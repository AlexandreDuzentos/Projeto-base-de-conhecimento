
exports.up = function(knex, Promise) {
    return knex.schema.createTable("categories", table => {
        table.increments("id").primary()
        table.string("name").notNull()
        table.integer("parentId").references("id")
             .inTable("categories") // estabelecendo um autorelacionamento, ou seja, categorias podem estar relacionadas entre si
             

    })
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable("categories")
};
