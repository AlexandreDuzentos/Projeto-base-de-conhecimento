const { authSecret } = require("../.env")
const passport = require("passport")
const passportJwt = require("passport-jwt")

/**
 * Importamos a **estratégia JWT** do `passport-jwt`.  
 * Importamos o **extrator do token** (`Extract`) para pegar o JWT da requisição. 
 */
const { Strategy, ExtractJwt } = passportJwt 

function passport1(app){

   // Configuração das Opções da Estratégia
   const params = {
       secretOrKey: authSecret, // obtendo a chave secreta
       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // obtendo o token jwt da requisição
   }

   /*
    Criação da estratégia JWT no passport

    **O que acontece aqui?**  
     Criamos uma **nova estratégia** usando `new Strategy(params, callback)`.  
     O Passport verifica o JWT **automaticamente** com base nas opções (`params`).  
     Se o JWT for válido, a função callback é chamada com `payload`.  

     #### **Explicação do Callback `(payload, done) => {}`**
     - **`payload`**: Contém os dados do usuário extraídos do token JWT.
     - **`done(null, user)`**: O usuário foi encontrado, então o Passport retorna o usuário autenticado.
     - **`done(null, false)`**: Se o usuário não for encontrado, o acesso é negado.
   */
   const strategy = new Strategy(params, (payload, done) => {
       app.db("users")
          .where({id: payload.id})
          .first()
          .then(user => done(null, user ? {...payload}: false))
          .catch(error => done(error, false))
   })

   /* Setando a estratégia no passport */
   passport.use(strategy)

   return {
     /*
      o primeiro parâmetro da função authenticate é a estratégia que será
      usada, que no caso é a jwt, e o segundo indicará se eu terei algum tipo
      de controle de sessão associado a essa autenticação.
      */
      authenticate: () => passport.authenticate('jwt' , {session: false })
   }

}

module.exports = passport1