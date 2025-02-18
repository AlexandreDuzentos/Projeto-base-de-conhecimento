<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}">
		<Header tittle="Cod3r - Base de Conhecimento"
		 :hideToggle="!user" :hideUserDropdown="!user"></Header>
		<Menu v-if="user"></Menu>
		<Loading v-if="validatingToken"></Loading>
		<Content v-else ></Content>
		<Footer></Footer>
	</div>
</template>

<script>
import { mapState } from "vuex" 
import axios from "axios"
import { baseApiUrl, userKey } from "./global"
import Header from "./components/template/Header.vue"
import Content from "./components/template/Content.vue"
import Footer from "./components/template/Footer.vue"
import Menu from "./components/template/Menu.vue"
import Loading from "./components/template/Loading.vue"

export default {
	name: "App",
	components: { Header, Content, Footer, Menu, Loading },
	computed: mapState(['isMenuVisible', 'user']),
	data: function(){
		return {
			 /*
			  Essa flag será usada para determinar se o token ainda
			  está sendo validado ou não, se essa flag for true  então
			  ficará uma tela de processamento na area do componente
			  content.
			  */
			 validatingToken: true
		}
	},
	methods: {
		/*
		 Método responsável por validar o token setado no localStorage
		 no backend.
		 */
		async validateToken(){
			this.validatingToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)
			/*
			 Ele tem de ser null nesse ponto, pois o token ainda não foi
			 validado, logo eu não quero que as configurações que fazem com
			 que a aplicação se comporte como se o token ainda estivesse válido,
			 Aqui eu tenho de zerar o user pois não posso permitir que um token
			 não validado seja setado na store da minha aplicação, por que se o 
			 token estiver inválido, um usuário que já não o token válido terá
			 acesso ao sistema como se ele tivesse um token válido.
			  */
            this.$store.commit('setUser', null) 

			if(!userData){
				 this.validatingToken = false
				 this.$router.push({ name: "auth" })
				 return
			}

			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)
			
			/* Se o teste for verdadeiro, então o token está válido */
			if(res.data){
				this.$store.commit('setUser', userData)
				
				if(this.$mq === 'xs' || this.$mq === 'sm'){
                   this.$store.commit("toggleMenu", false)
                }
			} else {
                localStorage.removeItem(userKey)
				this.$router.push({ name: "auth" })
			}

			/*
			 Nesse ponto a validação do token já terá sido feita
			 e por isso a flag validatingToken será setada para false,
			 isso para que também o componente loading desapareça.
			*/
			this.validatingToken = false


		}
	},

	/*
	 *  A função created será chamada sempre que
	    o navegador for recarregado, pois pois o recarregamento desmonta
		e remonta o componente raíz.
	 */
	created(){
       this.validateToken()
	}
}
</script>

<style>
   * {
	  font-family: "Sato", "sans-serif"
   }

   body {
	  margin: 0;
   }

   #app {
	 -webkit-font-smothing: antiliased;
	 -moz-osx-font-smothing: grayscale;

	 height: 100vh;
	 display: grid;
	 grid-template-rows: 60px 1fr 45px;
	 grid-template-columns: 300px 1fr;
	 grid-template-areas: 
	      'header header'
		  'menu content'
		  'menu footer';
   }

   #app.hide-menu {
	  grid-template-areas: 
	     'header header'
		 'content content'
		 'footer footer'
   }
</style>