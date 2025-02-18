<template>
   <div class="articles-by-category">
      <PageTitle icon="fa fa-folder-o"
       :main="category.name" sub="Categoria">
      </PageTitle>
      <ul>
        <li v-for="article in articles" :key="article.id">
            <ArticleItem :article="article"></ArticleItem>
        </li>
      </ul>
      <div class="load-more">
         <button v-if="loadMore" class="btn btn-lg btn-outline-primary"
         @click="getArticles">
              Carregar mais artigos
         </button>
      </div>
   </div>
</template>

<script>
  import { baseApiUrl, showError } from "@/global"
  import axios from "axios"
  import PageTitle from "../template/PageTitle"
  import ArticleItem from "./ArticleItem";

  export default {
     name: "ArticlesByCategory",
     components: { PageTitle, ArticleItem },
     data: function(){
        return {
          /* Vamos carregar o objeto de category associado ao id na url */
           category: {},

           /* usaremos para armazenar todos os artigos de uma categoria */
           articles: [],

           page: 1,

           /*
            usaremos para determinar a visilibidade do botão com a label
            load more.
            */
           loadMore: true

        }     
     },
     methods: {
       /* Função responsável por obter uma categoria pelo id passado na url */
       getCategory(){
          const url = `${baseApiUrl}/categories/${this.category.id}`
          axios.get(url).then(res => {
             this.category = res.data
          }).catch(showError)
       },
       /* Função responsável por carregar os artigos por categoria */
       getArticles(){
          const url = `${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}`
          axios.get(url).then(res => {
              this.articles = this.articles.concat(res.data)
              /*
                 Isso servirá para que quando o botão load more for clicado
                 ele traga os artigos de página seguinte.
               */
              this.page++ 

              /*
               Se na próxima página já não tiver registros, o botão
               load more já não será exibido.
               */
              if(res.data.length === 0){
                 this.loadMore = false
              }
          }).catch(showError)
       }
     },
     watch: {
         /*
          Monitorando mudanças de rota, isso é necessário para garantir
         que quando elas forem alterados, os artigos de uma nova categoria
         também sejam carregados, pois essa lógica de carregar os artigos
         associados a uma categoria acontece uma única vez, que é justamente
         quando o componente é carregado.
          */
         $route(to){
            this.category.id = to.params.id
            this.articles = []
            this.page = 1
            this.loadMore = true

            this.getCategory()
            this.getArticles()
         }
         
      },

     mounted(){
        /*
         Acessando o id passado na rota e atribuindo a propriedade id
         do objeto category
         */
        this.category.id = this.$route.params.id
        this.getCategory()
        this.getArticles()
     }
  }
</script>

<style>
   .articles-by-category ul {
     list-style-type: none;
     padding: 0;
   }

   .articles-by-category .load-more {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 25px;
   }
</style>