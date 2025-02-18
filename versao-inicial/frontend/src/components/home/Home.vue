<template>
   <div class="home">
    <PageTitle icon="fa fa-home" main="Dashboard"
     sub="Base de conhecimento"
     />
     <div class="stats">
          <Stat title="Categorias" icon="fa fa-folder" :value="stat.categories"
           color="#d54d50"></Stat>
          <Stat title="Artigos" icon="fa fa-file" :value="stat.articles"
           color="#3bc480"></Stat>
          <Stat title="Usuários" icon="fa fa-user" :value="stat.users"
           color="#3282cd"></Stat>
     </div>
   </div>
</template>

<script>
   import PageTitle from "../template/PageTitle.vue";
   import Stat from "./Stat.vue"
   import axios from "axios"
   import { baseApiUrl, showError } from "../../global"

   export default {
      name: "Home",
      components: { PageTitle, Stat },
      data: function(){
          return {
             stat: {}
          }
      },
       methods: {
          getStats(){
              axios.get(`${baseApiUrl}/stats`)
                  .then(res => this.stat = res.data)
                  .catch(showError)
          }
       },

       /*
        O mounted é um método de ciclo de vida que é chamado quando
        o componente é renderizado.
        */
       mounted(){
          /* Uma vez que o componente for  */
          this.getStats()
       }
   }
</script>

<style>
   .stats {
      display: flex;
      justify-content:space-between;
      flex-wrap: wrap;
   }
</style>