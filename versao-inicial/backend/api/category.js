const {existsOrError, notExistsOrError, isValidId} = require("./validation")()

function category(app){
      
    const saveOrUpdate = (req, res) => {
          /* 
          Escolher a dedo os campos de desejo que estejam no objeto
          category é mais seguro do que simplesmente clonar todo o objeto
          presente em req.body para category, eu consigo ter um controle maior
          sobre os campos.
           */
          const category = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
          }

          if(req.params.id) category.id = req.params.id

          try {
               existsOrError(category.name, "Nome não informado")
          } catch(msg) {
              /*
                o return servirá para parar a execução do código nesse ponto, isso é necessário,
                pois se o fluxo de execução for desviado para o catch é por que ocorreu algum
                erro.E quando ocorre algum erro eu não quero que o código na sequencia seja executado
              */
              return res.status(400).send(`<h1>${msg}</h1>`) 
          }

          if(category.id) {
            // update
              app.db("categories")
                 .update(category)
                 .where({id: category.id})
                 .then(_ => res.status(204).send())
                 .catch(error => res.status(500).send(`<h1>${error}</h1>`))
          } else {
            // save
             app.db("categories")
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(`<h1>${error}<h1>`))
          }
    }
    

    const remove = async (req, res) => {
      try {
         isValidId(req.params.id, `O id ${req.params.id} está inválido`)

         /* 
          buscando subcategoria, ou seja, categoria filha, se tiver
          uma subcategoria associada ao id da categoria que eu estou a tentar 
          excluir, eu não excluirei a categoria.
         */
         const subcategory = await app.db("categories")
              .where({ parentId: req.params.id })
               /*
                Se não existir a subcategoria associado ao id da categoria
                que estou a tentar remover, eu não tomarei nenhuma ação mas
                se existir uma exceção será lançada.

                Esse tratamento serve para evitar um erro de integridade referencial,
                pois se uma categoria pai for deletada e a ela estiver associada uma categoria
                filha, a categoria filha ficará com a referência errada, pois a categoria
                pai já não existe.

                Caso seja mesmo necessário remover uma categoria filha, o ideal seria
                eliminar primeiro categoria pai associada a ela.
               */
               notExistsOrError(subcategory, "Categoria possui subcategorias")


               const articles = await app.db("articles")
                     .where({ categoryId: req.params.id})
                
                 /*
                  Se não existir um artigo associado ao id da categoria
                  que estou a tentar remover, eu não tomarei nenhuma ação mas
                  se existir uma exceção será lançada.

                  Esse tratamento serve para evitar um erro de integridade
                  referencial, pois se eu deletar uma categoria e um artigo estiver
                  associado àquela, o artigo ficará com uma referência de uma categoria
                  que já não existe.

                  caso seja mesmo necessário deletar uma categoria associada a um
                  artigo, o ideal seria remover o artigo juntamente com a categoria.
                  
                 */
                notExistsOrError(articles, "Categoria possui artigos")

                const rowsDeleted = await app.db("categories")
                     .where({id: req.params.id}).del()
                
                existsOrError(rowsDeleted, "Categoria não foi encontrada")
                
                res.status(204).send()
      } catch(msg) {
         res.status(400).send(`<h1>${msg}</h1>`)
      }        
    }

    
    const withPath = categories => {
      /* Função responsável por obter uma categoria pai */
      const getParent = (categories, parentId) => {
          /*
            As categories que atenderem a condição serão retornadas para variável parent,
            testando se uma chave primária de uma categoria bate com a chave estrangeira de outra,
            se isso for verdadade, então achamos a categoria pai.
           */
          const parent = categories.filter(category => category.id === parentId)
          return parent.length ? parent[0] : null
      } 
      
      /* Função responsável por adicionar o atributo path aos objetos category */
      const categoriesWithPath = categories.data.map(category => {
          let path = category.name
          const count = categories.count
          const limit = categories.limit
          /* 
             Produto cartesiano + restrição de chaves correspondentes(chave primária e estrangeira)
             select parentCategory.name, childCategory.name from categories as childCategory inner join categories as parentCategory on childCategory.id =
             parentCategory.parentId
          */
          let parent = getParent(categories.data, category.parentId)  
      
          while(parent){
              path = `${parent.name} > ${path}`
              parent = getParent(categories.data, parent.parentId)
          }
      
          return {...category, path, count, limit}
      })
  
      /* Fazendo a ordenação pelo atributo path */
      categoriesWithPath.sort((catA, catB) => {
          if(catA.path < catB.path) return -1 // -1 indica que catA deve vir antes de catB
          if(catA.path > catB.path) return  1 // 1 indica que catA deve vir depois de catB
          return 0 // 0 indica de que catA e catB são iguais
      })

      return categoriesWithPath
  }

   /* Método responsável por listar categorias */
   const limit = 10
   const listAll = async (req, res) => {
    const page = req.query.page || 1

    const result = await app.db("categories").count("id").first()
    const count = parseInt(result.count)

    app.db("categories")
       .limit(limit).offset(page * limit - limit)
       .then(categories => res.json(withPath({data: categories, count: count, limit: limit})))
       .catch(error => res.status(500).send(`<h1>Aqui: ${error}</h1>`))
    }
  
  /* Função responsável por buscar uma categoria pelo id */
  const getById = (req, res) => {
    app.db("categories")
       .where({id : req.params.id})
       .first()
       .then(category => res.json(category))
       .catch(error => res.status(500).send(`<h1>${error}</h1>`))
       
   }

   /*
    Função responsável por formar uma árvore composta pelos
    parentNode e seus respectivos filhos.
    */
   const toTree = (categories, tree) => {
       /* Filtrando os parentNode, ou seja, os nodes sem pais */
       if(!tree) tree = categories.filter(category => !category.parentId)
       tree = tree.map(parentNode => {
           /* Função responsável por achar os nodes filhos de um parentNode */
           const isChild = node => node.parentId === parentNode.id
          // parentNode.children = categories.filter(isChild) essa soluçao encontra apenas os filhos diretos dos pais(raíz) e não os filhos indiretos
           parentNode.children = toTree(categories ,categories.filter(isChild)) // Com a recursividade nós conseguiremos achar os filhos diretos dos pais(raíz) e os filhos indiretos.

           return parentNode
       })

       return tree
   }

   const getTree = (req, res) => {
      app.db("categories")
         .then(categories => res.json(toTree(categories)))
         .catch(error => res.status(500).send(`<h1>${error}</h1>`))
   }

    return { saveOrUpdate, listAll, remove, getById, getTree}
}

module.exports = category