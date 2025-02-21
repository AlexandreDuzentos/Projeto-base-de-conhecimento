<template>
   <div class="article-admin">
      <b-form>
        <input id="article-id" type="hidden" v-model="article.id">
        <b-row>
           <b-col class="col-12">
              <b-form-group label="Nome:" label-for="article-name">
                  <b-form-input id="article-name" type="text"
                   v-model="article.name" required
                   placeholder="Informe o nome do Artigo" :readonly="mode === 'remove'">
                  </b-form-input>
              </b-form-group>
           </b-col>
         </b-row>
         <b-row>
           <b-col class="col-12">
              <b-form-group :readonly="mode === 'remove'" label="Descrição:" label-for="article-description">
                  <b-form-input id="article-description" type="text"
                  v-model="article.description" required 
                  :readonly="mode === 'remove'"
                  placeholder="Informe a descrição do artigo "
                  />
              </b-form-group>
           </b-col>
         </b-row>
         <b-row>
           <b-col class="col-12">
              <b-form-group :readonly="mode === 'remove'" label="Imagem (URL):" label-for="article-imageUrl">
                  <b-form-input id="article-description" type="text"
                  v-model="article.imageUrl" required 
                  :readonly="mode === 'remove'"
                  placeholder="Informe a URL da imagem..."
                  />
              </b-form-group>
           </b-col>
         </b-row>
         <b-row>
           <b-col class="col-12">
              <b-form-group label="Categoria:" label-for="article-categoryId">
                  <b-form-select :readonly="mode === 'remove'" id="article-categoryId"
                   :options="categories" v-model="article.categoryId">     
                  </b-form-select>
              </b-form-group>
           </b-col>
         </b-row>
         <b-row>
           <b-col class="col-12">
              <b-form-group label="Autor:" label-for="article-userId">
                  <b-form-select :readonly="mode === 'remove'" id="article-userId"
                   :options="users" v-model="article.userId">     
                  </b-form-select>
              </b-form-group>
           </b-col>
         </b-row>
         <b-row v-if="mode === 'save'">
           <b-col class="col-12">
              <b-form-group label="Conteúdo:" label-for="article-content">
                   <VueEditor v-model="article.content"
                      placeholder="informe o conteúdo do artigo">
                  </VueEditor>
              </b-form-group>
           </b-col>
         </b-row>
         <b-row class="mb-3">
          <b-col xs="12">
            <b-button variant="primary" v-if="mode === 'save'"
             @click="saveOrUpdate">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
             @click="remove">Excluir</b-button>
            <b-button @click="reset" class="ml-2">Cancelar</b-button>
          </b-col> 
        </b-row>
        </b-form>
        <!-- Componente responsável por renderizar a tabela -->
        <b-table hover striped :items="articles" :fields="fields" >
        <template slot="actions" slot-scope="data">
          <b-button variant="warning" @click="loadArticle(data.item)">
             <i class="fa fa-pencil"></i>
          </b-button>
          <b-button class="ml-2" variant="danger" @click="loadArticle(data.item, 'remove')">
             <i class="fa fa-trash"></i>
          </b-button>
        </template>
     </b-table>
     <!--
      A quantidade de botões de paginação gerado dependerá
      do resultado do seguinte cálculo =  total / limit, isso
      se eu quisesse construir uma paginador manualmente, sem ter
      de utilizar um componente.
      -->
     <b-pagination size="md" v-model="page"
      :total-rows="count" :per-page="limit" />
   </div>
</template>

<script>
   import axios from "axios"
   import { baseApiUrl, showError } from "@/global"
   import { VueEditor } from "vue2-editor"

   export default {
     name: "ArticleAdmin",
     components: { VueEditor },
     data: function(){
        return {
           mode: 'save',
           article: {},
           articles: [],
           categories: [],
           users: [],
           page: 1,
           limit: 0,
           count: 0,
           fields: [
              {key: 'id', label: "Código", sortable: true},
              {key: 'name', label: "Nome", sortable: true},
              {key: 'description', label: "Descrição", sortable: true},
              {key: "actions", label: "Ações"}
         ]
        }
     },

     methods: {
      loadArticles(){
         const url = `${baseApiUrl}/articles?page=${this.page}`
         axios.get(url).then(res => {   
             this.articles = res.data.data
             this.count = res.data.count
             this.limit = res.data.limit
         })

     },
     reset(){
         this.mode = "save"
         this.article = {}
         this.loadArticles()
      },
      saveOrUpdate(){
          const method = this.article.id ? 'put' : 'post'
          const id = this.article.id ? `/${this.article.id}` : ''
          axios[method](`${baseApiUrl}/articles${id}`, this.article)
               .then(_ => {
                   this.$toasted.global.defaultSuccess()
                   this.reset()
               }).catch(showError)
      },
      remove() {
         const id = this.article.id
         axios.delete(`${baseApiUrl}/articles/${id}`)
              .then(_ => {
                 this.$toasted.global.defaultSuccess()
                 this.reset()
              }).catch(showError)
      },

      loadArticle(article, mode = 'save'){
         this.mode = mode
         axios.get(`${baseApiUrl}/articles/${article.id}`).then(res => {
            this.article = res.data
         }).catch(showError)
      },
      loadCategories(){
        const url = `${baseApiUrl}/categories`
        axios.get(url).then(res => {
           this.categories = res.data.map(category => {
               return {value: category.id, text: category.path}
           })
        }).catch(showError)
      },
      loadUsers(){
         const url = `${baseApiUrl}/users`
         axios.get(url).then(res => {
              this.users = res.data.map(user => {
                  return { value: user.id, text: `${user.name} - ${user.email}`}
              })
         }).catch(showError)
      }
     },

     /*
      Função responsável por monitorar o status de um atributo
      do estado do meu componente.
      */
     watch: {
      page(){
           this.loadArticles()
      }
     },
     mounted(){
         this.loadUsers()
         this.loadCategories()
         this.loadArticles()
      } 
   }
</script>

<style>

</style>