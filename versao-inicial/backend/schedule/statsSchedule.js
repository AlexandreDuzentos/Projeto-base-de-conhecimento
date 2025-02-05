const schedule = require("node-schedule")

/*
 Função responsável por agendar a recorrência em que dados
 serão tranferidos do banco de dados não relacional para o banco relacional
 */
function scheduler(app){
    const { Stat } = require("../api/stat")(app)

    /* Essa tarefa será executada a cada um minuto */
        schedule.scheduleJob("*/1 * * * *", async function(){
        const usersCount = await app.db("users").count("id").first()
        const categoriesCount = await app.db("categories").count("id").first()
        const articlesCount = await app.db("articles").count("id").first()

        /* Pegando a última estatística do banco não relacional */
        const lastStat = Stat.findOne({}, {}, {sort: {'createdAt': -1}})

        /*
         Criando um instância do model e passando as estatísticas
         mais atualizadas para ele.

         Um model pode ser instânciado e receber como argumento 
         um objeto contendo os dados a serem salvos numa coleção.

         O objetivo da instância de um model é realizar alguma operação 
         de salvamento ou update.
         */
        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || lastStat.users !== stat.users
        const changeCategories = !lastStat || lastStat.categories !== stat.categories
        const changeArticles = !lastStat || lastStat.articles !== stat.articles
        /*
           Se alguma desses condições for verdadeira, então é altura
           de atualizar as estatísticas, ou seja, transferi-las do banco
           relacional para o não relacional.
         */
        if(changeUsers || changeCategories || changeArticles){
          /*
           O método save pode ser chamado a partir de uma instância de um model,
           e o objeto stat recebe a instância de um model, que é o model Stat.
         */
           stat.save().then(_ => console.log("Estatísticas atualizadas!"))

        }

    })
}

module.exports = scheduler