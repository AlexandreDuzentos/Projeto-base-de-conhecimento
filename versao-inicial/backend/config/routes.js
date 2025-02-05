module.exports = app => {
    const user = require("../api/user")(app)
    const category = require("../api/category")(app)
    const article = require("../api/article")(app)
    const auth = require("../api/auth")(app)
    const passport = require("./passport")(app)
    const admin = require("./admin")
    const stat = require("../api/stat")(app)

    /*
     Rotas autenticação - essas são as minhas rotas públicas, ou seja disponíveis
     para qualquer usuário acessar, pois elas não estarão sujeitas a validação de
     token, no entanto, as outras serão protegidas.
     */
    app.post("/signup", user.saveOrUpdate) // cadastro
    app.post("/signin", auth.signin) // login
    app.post("/validateToken", auth.validateToken)

    /* Rotas user  */
    /*
     a middleware retornado pela função authenticate irá manipular o objeto
     da requisição(req) adicionando a propriedade user que receberá um objeto
     com os dados decodificados do JWT proveniente do cliente, isso apenas
     acontencerá se a autenticação ocorrer com sucesso, os dados do usuário
     logada serão inseridos na propriedade user.
     */
    app.all("/users", passport.authenticate())
    app.post("/users", admin(user.saveOrUpdate))
    app.get("/users", admin(user.listAll))

    app.all("/users/:id", passport.authenticate())
    app.put("/users/:id", admin(user.saveOrUpdate))
    app.get("/users/:id", admin(user.getById))
    app.delete("/users/:id", admin(user.remove))


    // cuidado com a ordem das rotas, tem de vir antes de /categories/:id
    app.all("/categories/tree", passport.authenticate())
    app.get("/categories/tree", category.getTree)
    
    /* Rotas categories */
    app.all("/categories", passport.authenticate())
    app.post("/categories",admin(category.saveOrUpdate))
    app.get("/categories", category.listAll)

    app.all("/categories/:id", passport.authenticate())
    app.put("/categories/:id", admin(category.saveOrUpdate))
    app.get("/categories/:id", category.getById)
    app.delete("/categories/:id", admin(category.remove))

    /* Rotas articles */
    app.all("/articles", passport.authenticate())
    app.post("/articles", admin(article.saveOrUpdate))
    app.get("/articles", admin(article.listAll)) // essa listagem de artigos é para administradores

    app.all("/articles/:id", passport.authenticate())
    app.put("/articles/:id", admin(article.saveOrUpdate))
    app.get("/articles/:id", article.getById)
    app.delete("/articles/:id", admin(article.remove))

    app.all("/category/:id/articles", passport.authenticate())
    app.get("/category/:id/articles", article.getByCategory) // essa listagem de artigos é para usuários comuns

    /* Rotas estatísticas */
    app.all("/stats", passport.authenticate())
    app.get("/stats", stat.listAll)
       
}