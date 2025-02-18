import axios from "axios"
import Vue from "vue"
import Vuex from "vuex"

/*
 Essa será uma área de armazenamento de dados dos
 componentes que eu conseguirei compartilhar entre eles
 */

 Vue.use(Vuex) // informado para o vue que ele usará o Vuex

 /* Exportando por padrão a store que nós vamos usar */
 export default new Vuex.Store({
    /* Estado da aplicação(onde ficam armazenados os dados) */
    state: {
       isMenuVisible: false,
       user: null
    },

    /*
     As mutations são responsáveis por mudar o estado da aplicação, elas 
     são funções.
     */
    mutations: {
      toggleMenu(state, isVisible){
         if(!state.user){
            state.isMenuVisible = false
            return
         }

         if(isVisible === undefined){
            /*
             Fazendo a alternância entre visível e invisível,
             se estiver visivel ficará invisível e se estiver invisível
             ficará visível.
             */
            state.isMenuVisible = !state.isMenuVisible
         } else {
              /*
               Setando a visibilidade de acordo com o valor passado
               na propriedade isVisible.
               */
              state.isMenuVisible = isVisible
         }
      },
      setUser(state, user){
         state.user = user
         if(user){
            axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
            state.isMenuVisible = true
         } else {
            delete axios.defaults.headers.common['Authorization']
            state.isMenuVisible = false
         }
      }
    }
 })
