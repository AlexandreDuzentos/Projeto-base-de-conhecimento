<template>
    <header class="header">
        <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
            <i class="fa fa-lg" :class="icon"></i>
        </a>
        <h1 class="tittle"><router-link to="/">{{ tittle }}</router-link></h1>
        <UserDropdown v-if="!hideUserDropdown"/>
    </header>
</template>

<script>
    import UserDropdown from "./UserDropdown.vue";

    export default {
        name: "Header",
        components: { UserDropdown },
        props: {
            tittle: String,
            hideToggle: Boolean,
            hideUserDropdown: Boolean
        },
        computed: {
            icon(){
                return this.$store.state.isMenuVisible ? "fa-angle-left" : "fa-angle-down"
            }
        },
        methods: {
            toggleMenu(){
                 this.$store.commit("toggleMenu")
            }
        }

    }
</script>
   
<style>
     .header{
         grid-area: header;
         background: linear-gradient(to right, #13469a);
         display: flex;
         justify-content: center;
         align-items: center;
     }

     .tittle {
        font-size: 1.2rem;
        color: #fff;
        font-weight: 100;
        flex-grow: 1;
        display: flex;
        justify-content: center;
     }

     .tittle a {
         color: #fff;
         text-decoration: none;
     }

     .tittle a:hover {
        color: #FFF;
        text-decoration: none;
     }

     header.header > a.toggle {
        width: 60px;
        height:100%;
        color:#fff;
        justify-self: flex-start;
        text-decoration: none;
        display:flex;
        justify-content:center;
        align-items:center;
     }

     header.header > a.toggle:hover {
        background-color: rgba(0, 0, 0, 0.2);
        color: #fff;
     }
</style>