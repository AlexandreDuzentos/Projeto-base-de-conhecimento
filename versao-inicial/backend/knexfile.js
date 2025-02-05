const { relationalDB } = require("./.env")

// Update with your config settings.
module.exports = {
    client: 'postgresql',
    connection: {
      database: relationalDB.database,
      user:     relationalDB.user,
      password: relationalDB.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
