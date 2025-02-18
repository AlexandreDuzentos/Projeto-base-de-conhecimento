<template>
   <div class="category-admin">
      <b-form>
        <input id="category-id" type="hidden" v-model="category.id">
        <b-row>
           <b-col class="col-12">
              <b-form-group label="Nome:" label-for="category-name">
                  <b-form-input id="category-name" type="text"
                   v-model="category.name" required
                   placeholder="Informe a Categoria" :readonly="mode === 'remove'">
                  </b-form-input>
              </b-form-group>
           </b-col>
         </b-row>
         <b-row>
           <b-col class="col-12">
              <b-form-group label="Categoria pai:" label-for="category-parentId">
                  <b-form-select :readonly="mode === 'remove'" id="category-parentId"
                   :options="categories" v-model="category.parentId">
                      
                  </b-form-select>
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
        <b-table hover striped :items="categories" :fields="fields" >
        <template slot="actions" slot-scope="data">
          <b-button variant="warning" @click="loadCategory(data.item)">
             <i class="fa fa-pencil"></i>
          </b-button>
          <b-button class="ml-2" variant="danger" @click="loadCategory(data.item, 'remove')">
             <i class="fa fa-trash"></i>
          </b-button>
        </template>
     </b-table>
   </div>
</template>

<script>
   import axios from "axios"
   import { baseApiUrl, showError } from "@/global"

   export default {
     name: "CategoryAdmin",
     data: function(){
        return {
           mode: 'save',
           category: {},
           categories: [],
           fields: [
              {key: 'id', label: "Código", sortable: true},
              {key: 'name', label: "Nome", sortable: true},
              {key: 'path', label: "Caminho", sortable: true},
              {key: "actions", label: "Ações"}
         ]
        }
     },

     methods: {
      loadCategories(){
         const url = `${baseApiUrl}/categories`
         axios.get(url).then(res => {   
             this.categories = res.data.map(category => {
                /*
                 Os atributos value e text serão usados pelo select para
                 renderizar seus elementos, sendo que o texto renderizado
                 estará associado ao atributo text e o valor resgatado no 
                 backend será o valor associado ao value, o value representará
                 o atributo parentId resgatado lá no backend.
                 */
                return {...category, value: category.id, text: category.path}
             })
             console.log(this.categories)
             return
         })
     },
     reset(){
         this.mode = "save"
         this.category = {}
         this.loadCategories()
      },
      saveOrUpdate(){
          const method = this.category.id ? 'put' : 'post'
          const id = this.category.id ? `/${this.category.id}` : ''
          axios[method](`${baseApiUrl}/categories${id}`, this.category)
               .then(_ => {
                   this.$toasted.global.defaultSuccess()
                   this.reset()
               }).catch(showError)
      },
      remove() {
         const id = this.category.id
         axios.delete(`${baseApiUrl}/categories/${id}`)
              .then(_ => {
                 this.$toasted.global.defaultSuccess()
                 this.reset()
              }).catch(showError)
      },

      loadCategory(category, mode = 'save'){
         this.mode = mode
         this.category = { ...category }
         console.log(this.category)
      }
     },
     mounted(){
         this.loadCategories()
      } 
   }
</script>

<style>

</style>