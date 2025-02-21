const { existsOrError, notExistsOrError} = require("./validation")()
const query = require("./queries")

function article(app){
    
    const saveOrUpdate = (req, res) => {
         const article = {...req.body}
         if(req.params.id) article.id = req.params.id

         try {
               existsOrError(article.name, "Nome não informado!")
               existsOrError(article.description, "Artigo não informado!")
               existsOrError(article.categoryId, "Categoria não informada!")
               existsOrError(article.userId, "Autor não informado!")
               existsOrError(article.content, "Conteúdo não informado!")
         } catch(msg) {
               return res.status(400).send(`<h1>${msg}</h1>`)
         }

         if(article.id){
             app.db("articles")
                .update(article)
                .where({id: article.id})
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(`<h1>${error}</h1>`))
         } else {
            app.db("articles")
               .insert(article)
               .then(_ => res.status(204).send())
               .catch(error => res.status(500).send(`${error}`))
         }
        }

         const remove = async (req, res) => {

            try{

                const rowsAffected = await app.db("articles")
                .where({id: req.params.id}).del()
                
                try {
                    existsOrError(rowsAffected, "Artigo não foi encontrado")
                } catch(msg){
                    return res.status(400).send(`<h1>${msg}<h1>`)
                }

                return res.status(204).send()
            } catch(msg){
                return res.status(500).send(`<h1>${msg}</h1>`)
            }
         }

         /* CÓDIGO 1 */
         const limit = 10 // limite de registros por página
         const listAll = async (req, res) => {
              let page = req.query.page || 1 // página atual

              /* Buscando a quantidade de articles presentes no banco */
              let result = await app.db("articles").count("id").first()
              let count = parseInt(result.count)

              app.db("articles")
                 .select("id", "name", "description")
                 .limit(limit).offset(page * limit - limit) // lógica da paginação
                 .then(articles => res.json({data: articles, count, limit}))
                 .catch(error => res.status(500).send(error))
         }

         const getById = (req, res) => {
            app.db("articles")
               .where({id: req.params.id})
               .first()
               .then(article => {
                  /* Convertendo um formato binary para String */
                  
                  article ? article.content = article.content.toString() : null
                  return res.json(article)
               }).catch(error => res.status(500).send(`<h1>${error}</h1>`))
         }
         
         /* Função responsável por buscar artigos pelo id das categorias(categoria pai e filhas) */
         const getByCategory = async (req, res) => {
             const categoryId = req.params.id
             const page = req.query.page | 1

             /*
              A função raw permite fazer uma consulta pura SQL, o primeiro parâmetro
              é a consulta e segundo é o parâmetro para substituir o placeholder da
              consulta.
             */
             const categories = await app.db.raw(query.categoryWithAllChildren, categoryId)
             const ids = categories.rows.map(c => c.id)
             
             /* Setando um alias para as tabelas */
             app.db({a: "articles", u: "users"})
                .select("a.id", "a.name", "a.description", "a.imageURL", {author: "u.name"}) // author é um alias para o nome do campo name da tabela de users
                .limit(limit).offset(page * limit - limit) // lógica da paginação
                .whereRaw("?? = ??", ['u.id', 'a.userId']) // restrição de chaves correspodentes(chave primária e estrangeira)
                .whereIn('categoryId', ids)
                .orderBy('a.id', 'desc')
                .then(articles => res.json(articles))
                .catch(error => res.status(500).send(`<h1>${error}</h1>`))

         }

    return {saveOrUpdate, remove, listAll, getById, getByCategory}
}

module.exports = article