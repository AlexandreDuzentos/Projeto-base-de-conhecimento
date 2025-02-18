const { authSecret } = require("../.env")
const jwt = require("jwt-simple")
const bcrypt = require("bcrypt-nodejs")

function auth(app){

    const signin = async (req, res) => {
        if(!req.body.email && !req.body.password) {
            return res.status(400).send('Informe usuário e senha')
        }

        const user = await app.db("users")
           .where({email: req.body.email})
           .first()

           if(!user){
               return res.status(400).send("Usuário não encontrado!")
           }

           const isMatch = bcrypt.compareSync(req.body.password, user.password)
           if(!isMatch){
               /* O código http 401 indica acesso não autorizado */
               return res.status(401).send("Email/senha inválido")
           }

           /*
            Convertendo a data de millisegundos para segundos
            */
           const now = Math.floor(Date.now() / 1000)

           /*
            O payload representa o corpo do token, as informações contidas
            nesse objeto serão usadas para gerar o JWT

            Os nomes dos campos iat(issued at) e exp não foram definidos de
            forma aleatória, eles são um padrão do JWT
            */
           const payload = {
              id: user.id,
              name: user.name,
              email: user.email,
              admin: user.admin,
              iat: now, // data em que o token foi emitido
               /*
               data em que o token expirará, como o token é enviada para
               a máquina do usuário, isso significa que mesmo que o usuário
               fechar o browser ele consegue se logar enquanto token for válido,
               o token fica armazenado no localStorage.
               */
              exp: now + (60 * 60 * 24 * 3) 
    }

    res.json({    
        ...payload,
        token: jwt.encode(payload, authSecret)   // gerando o token jwt  
    })
}

/* Função responsável por validar TOKENs */
const validateToken = (req, res) => {
    const userData = req.body || null
    try {
         if(userData){
            /*
               Se o token já não for válido  ou se o authSecret usado para gerar o
               token for diferente do  authSecret usado para decodificar o token o
               fluxo de execução será desviado para o catch ou também se a
               assinatura do  token for alterada, ela pode ser alterada no meu
               sistema caso o meu authSecret tenha vazado.
             */
            const token = jwt.decode(userData.token, authSecret) // decodificando o token
            if(new Date(token.exp * 1000) > new Date()){
                /*
                 Aqui eu poderia renovar o token do cliente, enviando 
                 um novo para ele ao invês da resposta abaixo.
                 */

                 // enviando uma resposta indicando que o token ainda está válido
                return res.send(true)

            }
         }
    } catch(msg){
        // problema com o token
        return res.send(false)
    }
}

/* 
  Método responsável por validar se um usuário que está no localstorage
  é um administrador.
 */
const validateAdmin = async (req, res, next) => {
    const user = req.body || null

    try {
       if(user){

           const userData = await app.db("users")
                          .where({email: user.email})
                          .first()

         if(userData){
            if(req.body.admin && userData.admin){
                return res.send(true)
            } else {
                return res.send(false)
            }
         } else {
             throw new error("Usuário não encontrado!")
         }
         
       }
    } catch(msg){
        return res.status(401).send(msg)
    }
}

    return {signin, validateToken, validateAdmin}

}

module.exports = auth