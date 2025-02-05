module.exports = _ => {
 /*
 função responsável por testar se o argumento passado para a função existe,
 caso não exista, uma exceção será lançada.
 */
function existsOrError(value, msg){
    if(!value) throw msg
    if(Array.isArray(value) && value.length === 0) throw msg
    if(typeof value === "string" && !value.trim()) throw msg 
  }
  
  /*
 função responsável por testar se o argumento passado para a função não existe.
 */
  function notExistsOrError(value, msg){
    try {
      existsOrError(value, msg)
    } catch(msg){
       return 
    }
  
    throw msg
  }
  

  /*
   Função responsável por testar se dois valores são diferentes, caso sejam,
   uma exceção será lançada.
   */
  function equalsOrError(valueA, valueB, msg){
     if(valueA !== valueB) throw msg
  }

  function isValidId(value, msg){
     if(!value > 0 && !Number.isInteger(value)) throw msg
  }

  return {existsOrError, notExistsOrError, equalsOrError, isValidId}
}

