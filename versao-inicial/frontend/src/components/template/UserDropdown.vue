<template>
   <div class="user-dropdown">
      <div class="user-button">
          <span class="d-none d-sm-block">{{ user.name }}</span>
          <div class="user-dropdown-img">
              <Gravatar :email="user.email" alt="User"/>
          </div>
          <i class="fa fa-angle-down"></i>
      </div>
      <div class="user-dropdown-content">
          <router-link to="/admin" v-if="user.admin">
            <i class="fa fa-cogs"></i> Administração
          </router-link>
          <a @click.prevent="logout">
            <i class="fa fa-sign-out"></i> Sair
          </a>
      </div>
   </div>

</template>

<script>
   import { mapState } from "vuex"
   import Gravatar from "vue-gravatar"
   import { userKey } from "@/global"

   export default {
      name: "UserDropdown",
      components: { Gravatar },
      computed: mapState(["user"]),
      methods: {
        logout(){
           localStorage.removeItem(userKey)
           this.$store.commit("setUser", null)
           this.$router.push({ name: "auth" })
        }
      }
      
   }
</script>

<style>
    .user-dropdown {
        height: 100%;
       /* position: relative;*/
    }

    .user-button {
        display: flex;
        align-items: center;
        color: #fff;
        font-weight: 100;
        height: 100%;
        padding: 0px 20px;
    }

    .user-dropdown:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .user-dropdown-img {
         margin: 0px 10px;
    }

    .user-dropdown-img > img {
        max-height: 37px;
        border-radius: 5px;
    }

    .user-dropdown-content {
       /*
        Quando você aplica position: absolute a um elemento, o valor padrão
        da propriedade top é auto. Isso significa que, se você não definir um
        valor específico para top, o elemento não será posicionado em relação
        ao seu contêiner pai (ou ao elemento mais próximo com position: relative,
        absolute, ou fixed), mas ficará no fluxo normal do documento
        (onde o navegador decide sua posição).

        Sim! O position: absolute pode ser usado para exibir um elemento que
        inicialmente não está visível na página. Isso é bastante comum em menus
        dropdown, pop-ups, tooltips e outros elementos interativos.

🚀      Como Exibir um Elemento Oculto com position: absolute?
         A estratégia típica é:

         Definir display: none ou opacity: 0; visibility: hidden; inicialmente
         para esconder o elemento.

         Torná-lo visível dinamicamente ao interagir com outro elemento (como
         um botão ou hover).

         Usar position: absolute para colocá-lo na posição desejada.
       */
       position: absolute; /* Garantir que o content seja exibido na posição desejada(debaixo do botão) */
       right: 0;
       background-color: #fff;
       min-width: 170px;
       box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
       padding: 10px;
       z-index: 1;
       display: flex;
       flex-direction:column;
       flex-wrap: wrap;
       visibility: hidden;
       opacity: 1;
       transition: visibility 0.5, opacity 0.5s linear;
    }

    .user-dropdown:hover .user-dropdown-content {
        /*
         O position absolute também poderia estar aqui nesse seletor
        position: absolute;
        right:0px;
        */
        visibility: visible;
        opacity: 1;
    }

    .user-dropdown-content a {
        text-decoration:none;
        color: #000;
        padding: 10px;
    }

    .user-dropdown-content a:hover {
        text-decoration: none;
        color: #000;
        background-color: #ededed;
    }
</style>