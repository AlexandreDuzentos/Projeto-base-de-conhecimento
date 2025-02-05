function stat2(app){
    /*
       Criando um model chamado Stat e seu respectivo schema

       No MongoDB, um Model (ou modelo) é uma representação de uma coleção no
       banco de dados. Ele define a estrutura dos documentos, as regras de
       validação e fornece métodos para interagir com os dados.

       No Mongoose, um Model é criado a partir de um Schema e serve como a
       interface principal para manipular documentos no MongoDB.

       O que um Model faz?
       Define como os dados devem ser armazenados (tipos, validações, padrões).
       Permite CRUD (Create, Read, Update, Delete) facilmente.
       Atua como ponte entre o código JavaScript e o banco MongoDB.
    */
   app.mongoose.models = {} // resolver o bug(cannot override model once compiled)
   const Stat = app.mongoose.model('Stat', {
       users: Number,
       categories: Number,
       articles: Number,
       createdAt: Date
   })

   const listAll = (req, res) => {
      /*
       Buscando uma estatística do model Stat e ordenando os resultado
       pelo campo createdAt em ordem decrescente
       */
      Stat.findOne({}, {}, {sort: {'createdAt': -1}})
          .then(stat => {
            let defaultStat = {
                users: 0,
                categories: 0,
                articles: 0
            }

            res.json(stat || defaultStat)
          })
          .catch(error => res.status(500).send(`<h1>${error}<h1>`))
   }

   return { listAll, Stat}
}

module.exports = stat2