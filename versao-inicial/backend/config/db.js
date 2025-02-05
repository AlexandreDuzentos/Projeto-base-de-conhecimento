/* Importando o arquivo de configuracao do knex */
const config = require("../knexfile")

/** Importando e instânciando o knex */
const knex = require("knex")(config)

/*
Executando a migration de forma programática, também é possível executa-la
pela linha de comando.
 */
knex.migrate.latest([config])

/* Exportando o knex */
module.exports = knex