const mongoose = require("mongoose")
const { nonRelationalDB } = require("../.env")

/* Estabelencendo uma conexão com o banco de dados não relacional mongoDB */
mongoose.connect(nonRelationalDB.connectionURL, 
        {
            /* 
               Por que usar useNewUrlParser: true?
               Nas versões mais antigas do MongoDB Node.js Driver, a URL de
               conexão era analisada por um parser legado, que tinha problemas
               com alguns formatos de string de conexão.

               A partir da versão 4.x do MongoDB, um novo parser de URL foi
               introduzido, mais robusto e compatível com padrões modernos.
               O Mongoose recomenda ativá-lo para evitar avisos e problemas de
               compatibilidade.
             */
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }).then(_ => {
            const sucess = "Conexão estabelecida com sucesso!"
            console.log(sucess)
        }).catch(_ => {
            const error = "ERRO! Não foi possível conectar com o mongoDB!"
            console.log(error)
        })
        