const bcrypt = require("bcrypt-nodejs")
const {existsOrError, notExistsOrError, equalsOrError } = require("./validation")()

/* Função responsável por salvar um usuário */
function user(app){

    /* Função responsável por criptografar a password  */
    const encryptPassword = password => {
        /*
         A função genSaltSync do bcrypt_nodejs serve para gerar um "salt"
         (um valor aleatório) usado na criptografia de senhas. O salt é combinado
         com a senha antes da aplicação do algoritmo de hash, tornando o hash
         resultante mais seguro, ele gera o salt de forma síncrona, ou seja, a
         execução código na sequência é bloqueado até que a operação esteja concluída.
        */
        const salt = bcrypt.genSaltSync(10)

        /*
         A função hashSync gera o hash de senha, e também é executado de forma
         síncrona
          */
        return bcrypt.hashSync(password, salt)
    }

    /* Função responsável por salvar ou atualizar usuários */
    const saveOrUpdate = async (req, res) => {
       const user = {...req.body}
       if(req.params.id) user.id = req.params.id

       /*
        Validando se o usuário é admin ou não, se passar desses testes,
        quer dizer que ele é admin, e o atributo admin estará setado para 
        true.
        */
       if(!req.originalUrl.startsWith("/users")) user.admin = false
       if(!req.user || !req.user.admin) user.admin = false

       try {
           /* Validações de campos  */
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não conferem')

           /*
              Buscando um usuário do banco de dados para testar se ele já
              está cadastrado.
            */
              const userFromDB = await app.db('users')
              .where({ email: user.email }).first()
               if(!user.id) {
                  notExistsOrError(userFromDB, 'Usuário já cadastrado')
               }
                  
       } catch(msg) {
           return res.status(400).send(`<h1>${msg}</h1>`) // o return fará com que a execução do código pare
       }


       user.password = encryptPassword(user.password) // criptografando a password
       delete user.confirmPassword // eliminando a confirmação da password, pois ela não será inserida na DB

       if(user.id){
           // update
           app.db()
              .update(user)
              .where({id: user.id})
              .whereNull('deletedAt') // isso é para impedir de atualizar um usuário que "não existe" na tabela
              .then(_ => res.status(204).send())
              .catch(error => res.status(500).send(`<h1>${error}</h1>`))
       } else {
          // save
          app.db("users")
             .insert(user)
             .then(_ => res.status(204).send())
             .catch(error => res.status(500).send(`<h1>${error}</h1>`))
       }
    }

    
    /* Método listAll  */
    const listAll = (req, res) => {
       app.db("users")
          .select("id", "name", "email", "admin")
          .whereNull('deletedAt') // isso é para impedir de listar um usuário que "não existe" no frontend
          .then(users => res.json(users))
          .catch(error => res.status(500).send(`<h1>${error}</h1>`))
    }

    /* Método getById */
    const getById = (req, res) => {
      app.db("users")
         .select("id", "name", "email", "admin")
         .where({id: req.params.id})
         .whereNull('deletedAt')
         .then(user => res.json(user))
         .catch(error => res.status(500).send(`<h1>${error}</h1>`))
    }

    const remove = async (req, res) => {
        try {
              const articles = await app.db('articles')
                  .where({userId : req.params.id})
               
                  notExistsOrError(articles, "Usuário possui artigos!")

               /*
                Efetuando um soft delete, esse tipo de delete é na verdade
                um update, ele é usado para que eu tenha condições de decidir
                que dados armazenados no banco de dados não serão acessados
                pelo meu frontend, o campo deletedAt será usado como critério
                para determinar que o registro não deverá ser apresentado
                no frontend.
                 */
               const rowsUpdated = await app.db("users")
                              .update({deletedAt: new Date()})
                              .where({ id: req.params.id })
                existsOrError(rowsUpdated, "Usuário não foi encontrado")

                return res.status(204).send()
        } catch(msg) {
             return res.status(400).send(`<h1>${msg}</h1>`)
        }
    }
   
    return { saveOrUpdate, listAll, getById, remove}
}

module.exports = user