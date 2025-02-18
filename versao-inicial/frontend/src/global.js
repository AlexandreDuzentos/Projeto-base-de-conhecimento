import Vue from "vue"

export const userKey =  '__knowledge_user'
export const baseApiUrl = "http://localhost:3000"

/* Função responsável por me ajudar a exibir uma mensagem de erro vinda do backend */
export function showError(e){
    if(e && e.response && e.response.data){
        Vue.toasted.global.defaultError({ msg: e.response.data })
    } else if(typeof e === 'string') {
        Vue.toasted.global.defaultError({msg : e})
    } else {
        Vue.toasted.global.defaultError()
    }
}


