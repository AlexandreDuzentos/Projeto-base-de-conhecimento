<template>
   <div class="article-by-id">
       <PageTitle icon="fa fa-file-o" :main="article.name" :sub="article.description" />
       <div class="article-content" v-html="article.content"></div>
   </div>
</template>

<script>
  import {showError, baseApiUrl } from "@/global"
  import axios from "axios"
  import PageTitle from "../template/PageTitle"

  export default {
    name: "ArticleById",
    components: { PageTitle },
    data: function(){
        return {
          article: {}
        }
    },
    mounted(){
       const url = `${baseApiUrl}/articles/${this.$route.params.id}`
       axios.get(url)
            .then(res => {
                this.article = res.data
            })
            .catch(showError)
    },
  }
</script>

<style>
   .article-content {
      background-color: #FFF;
      border-radius: 8px;
      padding: 25px;
   }

   .article-content pre {
      padding: 20px;
      border-radius: 8px;
      font-size: 1.2rem;
      background-color: #2d2d30;
      color: #FFF;
   }

   .article-content img {
     max-width: 100%;
   }

   .article-content :last-child{
      margin-bottom: 0px;
   }
</style>