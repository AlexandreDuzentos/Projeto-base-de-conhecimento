import Vue from "vue"
import Toasted from "vue-toasted"

Vue.use(Toasted, {
    iconPack: 'fontawesome', // definindo a biblioteca de ícones para o vue toasted
    duration: 3000 // definindo a duração da mensagem na tela
})

/* Setando mensagens padrão de erro e de sucesso para o vue toasted */
Vue.toasted.register(
    'defaultSuccess',
     payload => !payload.msg ? "Operação realizada com sucesso" : payload.msg,
     { type: 'success', icon: 'check' }
)

Vue.toasted.register(
    'defaultError',
    payload => !payload.msg ? "Oops...Erro inesperado!" : payload.msg,
    {type: 'error', icon: 'times'}
)