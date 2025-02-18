import vue from "vue"
import vueRouter from "vue-router"

import Home from "../components/home/Home"
import AdminPages from "../components/admin/AdminPages"
import VueRouter from "vue-router"
import ArticlesByCategory from "../components/article/ArticlesByCategory"
import ArticleById from "../components/article/ArticleById"
import Auth from "../components/auth/Auth"
import { userKey } from "@/global"
import axios from "axios"
import { baseApiUrl } from "../global"


vue.use(vueRouter) // registrando o vueRouter dentro do vue

const routes = [
    {
        name: 'home',
        path: "/",
        component: Home
    },
    {
        name: 'adminPages',
        path: "/admin",
        component: AdminPages, 
        /*
         O atributo meta permite definir metadados para
         uma rota por meio de um objeto que ele recebe.
         */
        meta: {requiresAdmin: true }
    },
    {
        name: 'articlesByCategory',
        path: "/categories/:id/articles",
        component: ArticlesByCategory
    },
    {
        name: 'articleById',
        path: "/articles/:id",
        component: ArticleById
    },
    {
        name: "auth",
        path: "/auth",
        component: Auth
    }
]

/*
 Instânciando um vueRouter e passando para o construtor dele
 o modo de rota e as rotas.
 */
const router = new VueRouter({
    mode: 'history',
    routes
})

/*
A função beforeEach do objeto VueRouter recebe uma callback
como argumento, e essa callback é chamada toda vez que ocorre uma
navegação de uma rota para outra.

to - representa a rota para onde a navegação irá
from - representa a rota de onde a navegação vem
next - chama a rota to.
 */
router.beforeEach(async (to, from , next) => {
    const json = localStorage.getItem(userKey)
    const userData = JSON.parse(json)  

    /*
     Testando se a rota para onde estou indo possui um
     atributo chamado requiresAdmin setado dentro de meta,
     record é justamente a rota.
     */
    if(to.matched.some(record => record.meta.requiresAdmin)) {
        const resp = await axios.post(`${baseApiUrl}/validateAdmin`, userData)
        
        /*
         Testando se o user está setado e se ele é um admin,
         se isso for verdade, então o next chamará o componente
         da rota de destino, que é justamente a rota que possui
         a propriedade requiresAdmin setado com true, senão o next
         chamará o componente da rota raíz, que é o home.
         */
        resp.data ? next() : next({ path: "/"} )
    } else {
        next()
    }
})

export default router