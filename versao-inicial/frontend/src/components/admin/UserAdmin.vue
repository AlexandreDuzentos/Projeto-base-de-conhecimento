<template>
  <div class="user-admin">
     <b-form>
        <input id="user-id" type="hidden" v-model="user.id">
        <b-row>
           <b-col md="6" sm="12">
              <b-form-group label="Nome:" label-for="user-name">
                  <b-form-input id="user-name" type="text"
                   v-model="user.name" required
                   placeholder="Informe o nome do Usuário" :readonly="mode === 'remove'">
                  </b-form-input>
              </b-form-group>
           </b-col>
           <b-col md="6" sm="12">
              <b-form-group label="Email:" label-for="user-email">
                  <b-form-input id="user-email" type="text"
                   v-model="user.email" required
                   placeholder="Informe o email do Usuário" :readonly="mode === 'remove'">
                  </b-form-input>
              </b-form-group>
           </b-col>
        </b-row>
         <b-form-checkbox id="user-admin" v-model="user.admin" class="mb-3 mt-3" v-show="mode === 'save'">
           Administrador
         </b-form-checkbox>
        <b-row v-show="mode === 'save'">
           <b-col md="6" sm="12">
              <b-form-group label="Senha:" label-for="user-password">
                  <b-form-input id="user-password" type="password"
                   v-model="user.password" required
                   placeholder="Informe a Senha do Usuário...">
                  </b-form-input>
              </b-form-group>
           </b-col>
           <b-col md="6" sm="12">
              <b-form-group label="Confirmação de senha:" label-for="user-confirm-password">
                  <b-form-input id="user-confirm-password" type="password"
                   v-model="user.confirmPassword" required
                   placeholder="Confirme a Senha do Usuário...">
                  </b-form-input>
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
     <b-table hover striped :items="users" :fields="fields" >
        <template slot="actions" slot-scope="data">
          <b-button variant="warning" @click="loadUser(data.item)">
             <i class="fa fa-pencil"></i>
          </b-button>
          <b-button class="ml-2" variant="danger" @click="loadUser(data.item, 'remove')">
             <i class="fa fa-trash"></i>
          </b-button>
        </template>
     </b-table>
     <b-pagination size="md" v-model="page"
     :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
  import { baseApiUrl } from "@/global"
  import { showError } from "@/global"
  import axios from "axios"

  export default {
     name: "UserAdmin",
     data: function(){
       return {
         mode: "save", // propriedade responsável por indicar em qual modo o formulário está
         user: {}, // objeto responsável por armazenar um user
         users: [], // objeto responsável por guardar uma coleção de objetos
         page: 1,
         count: 0,
         limit: 0,
         fields: [
              {key: 'id', label: "Código", sortable: true},
              {key: 'name', label: "Nome", sortable: true},
              {key: 'email', label: "E-mail", sortable: true},
              {key: 'admin', label: "Administrador", sortable: true,
                 formatter: value => value ? "Sim" : "Não"
              },
              {key: "actions", label: "Ações"}
         ]
       }
     },
     methods: {
        /* Função responsável por buscar todos os usuários do backend */
        loadUsers(){
           const url = `${baseApiUrl}/users?page=${this.page}`
           axios.get(url).then(res => {
              this.users = res.data.data
              this.count = res.data.count,
              this.limit = res.data.limit
              console.log(res.data)
              return
           })
      },
     /* Função responsável por retornar o formulário ao estado inicial */
     reset(){
        this.mode = 'save'
        this.user = {}
        this.loadUsers()
     },

     /* Função responsável por salvar ou atualizar um usuário */
     saveOrUpdate(){
        const method = this.user.id ? "put" : "post"
        const id = this.user.id ? `/${this.user.id}` : ""  
        axios[method](`${baseApiUrl}/users${id}`, this.user)
             .then(_ => {
                 this.$toasted.global.defaultSuccess() // exibindo mensagem de sucesso
                 this.reset() // resetando o formulário
             }).catch(showError)
     },

     remove(){
        const id = this.user.id
        axios.delete(`${baseApiUrl}/users/${id}`)
             .then(_ => {
                this.$toasted.global.defaultSuccess()
                this.reset()
             }).catch(showError)
     },
     loadUser(user, mode = "save"){
         this.mode = mode
         this.user = {...user}
     }
    },
    /*
      Função responsável por monitorar o status de um atributo
      do estado do meu componente.
      */
      watch: {
      page(){
           this.loadUsers()
      }
     },
    /* Método de ciclo de vida chamado quando o componente é renderizado */
    mounted(){
         this.loadUsers()
      }
  }
</script>

<style>

</style>