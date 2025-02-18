<template>
   <div class="auth-content">
       <div class="auth-modal">
          <img src="@/assets/logo.png" width="200" alt="Logo">
          <hr>
          <div class="auth-title">{{  showSignup ? 'Cadastro' : 'Login' }}</div>

          <input v-if="showSignup" v-model="user.name" type="text"
           placeholder="Nome">
          <input  v-model="user.email" type="email" placeholder="Email">
          <input  v-model="user.password" type="password" placeholder="Senha">
          <input v-if="showSignup" v-model="user.confirmPassword" type="password"
           placeholder="Confirme a senha">
            
           <button v-if="showSignup" @click="signup">Registrar</button>
           <button v-else @click="signin">Entrar</button>

           <!--
            Link responsável por fazer o chaveamento entre
            os dois formulários(login, cadastro) por meio
            da alternância entre os valores true e false
            na propriedade showSignup
            -->
            <a href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup">já tem cadastro? Acesse o login!</span>
                <span v-else>Não tem cadastro? Registre-se aqui!</span>
            </a>
       </div>
   </div>
</template>

<script>
  import {baseApiUrl, showError, userKey} from "@/global"
  import axios from "axios"

  export default {
    name: "Auth",
    data: function(){
        return {
            /*
             Flag que será usada para chavear entre o formulário 
             de login e o de cadastro, quando falso, o formulário de
             login será exibido, quando verdadeira o de cadastro será exibido
             */
            showSignup: false,
            user: {}
        }
    },
    methods: {
        /* Login  */
       signin(){
         axios.post(`${baseApiUrl}/signin` ,this.user)
              .then(res => {
                  this.$store.commit("setUser", res.data)
                  /*
                   As chaves e os valores dentro do localStorage
                   precisam ser do tipo String
                   */
                  localStorage.setItem(userKey, JSON.stringify(res.data))

                  /* Fazendo uma navegação para a raíz da minha aplicação(tela principal) */
                  this.$router.push({ path: "/" })

              }).catch(showError)
       },
       /* Cadastro */
       signup(){
         axios.post(`${baseApiUrl}/signup`, this.user)
              .then(_ => {
                  this.$toasted.global.defaultSuccess()
                  this.user = {}
                  this.showSignup = false // vai mudar para tela de login
              }).catch(error => console.log(error))
       },
    },
  }
</script>

<style>
   .auth-content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
   }

   .auth-modal {
     background-color: #fff;
     width: 350px;
     padding: 35px;
     box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);

     display: flex;
     flex-direction: column;
     align-items: center;
   }

   .auth-title {
     font-size: 1.2rem;
     font-weight: 100;
     margin-bottom: 15px;
   }

   .auth-modal input {
      border: 1px solid #bbb;
      width: 100%;
      margin-bottom: 15px;
      padding: 3px 8px;
      outline: none;
   }

   .auth-modal button {
     align-self: flex-end;
     background-color: #2460ae;
     color: #FFF;
     padding: 5px 15px;
     border: none;
   }

   .auth-modal a {
     margin-bottom: 15px;
   }

   .auth-modal hr {
      border: 0;
      width: 100%;
      height: 1px;
      background-image: linear-gradient(to right,
      rgba(120, 120, 120,0),
      rgba(120, 120, 120, 0.15),
     rgba(120, 120, 120,0)  )
   }
</style>