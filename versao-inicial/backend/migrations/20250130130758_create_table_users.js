
/* 
A função up define como criar e modificar tabelas, ou seja, ela permite evoluir
o banco de dados.
*/
exports.up = function(knex, Promise) {
    return knex.schema.createTable("users", table => {
         table.increments("id").primary()
         table.string("name").notNull()
         table.string("email").notNull().unique()
         table.string("password").notNull()
         table.boolean("admin").notNull().defaultTo("false")
    })
};


/* A função up define como reverter as mudanças feitas no down */
exports.down = function(knex, Promise) {
   return knex.schema.dropTable("users")
};
