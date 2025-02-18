import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'
import store from "./config/store"
import "./config/bootstrap"
import "./config/msgs"
import "./config/axios"
import "./config/mq"
import router from "./config/router"

Vue.config.productionTip = false // especifíca o modo em que a aplicação está(prodution ou development)
Vue.config.devtools = false // garante que o devtools funcione no modo de desenvolvimento

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')