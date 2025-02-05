/* 
 Comparando a chave primária da minha DCE(subcategories) com as chaves estrangeiras da
 tabela categories, os registros resultantes serão as subcategorias, isso porque
 as categories terão como parentId o mesmo id da categoria pai, em outras palavras,
 é uma comparação do id do registro pai com o parentId(campo que cria a relação com o registro pai na tabela filha)
*/
module.exports = {
     categoryWithAllChildren: `
          WITH RECURSIVE subcategories (id) AS (
             SELECT id from categories WHERE id = ?

             UNION ALL

             SELECT c.id FROM categories c inner join subcategories sb
             ON sb.id = c."parentId"
          )
        SELECT id from subcategories
     `
}