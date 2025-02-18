import axios from "axios"

/*
Nesse arquivo criaremos uma forma global
de interceptar códigos de erro ou sucesso retornados
pelos backend, quando falo global, me refiro ao fato
dessa lógica não estar associada diretamente a nenhum
componente específico.
 */

const success = res => res

const error = err => {
   if(401 === err.response.status){
       /*
        Fazendo uma navegação via javascript para a rota raíz, o que
        fará com que a componente App seja lido novamente e a verificação
        da validade do token seja feita.
        */
       window.location = "/" 
   } else {
      return Promise.reject(err)
   }
}

/*
 Registrando as callbacks de sucesso e erro dentro do interceptador
 do axios, quando ele detetar uma mensagem de sucesso, a primeira callback
 será chamada e para ela passada um objeto contento todos os códigos de status http, quando ele
 detectar uma mensagem de erro, a segunda callback será chamada e para ela
 passada um objeto contendo todos os códigos de status http.
 */
axios.interceptors.response.use(success, error)