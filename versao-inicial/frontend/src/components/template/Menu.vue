<template>
   <!--
     O v-show esconde ou exibibe um elemento, ele não remove o elemento
     da DOM ao contrário do v-if 
    -->
   <aside class="menu" v-show="isMenuVisible">
      <div class="menu-filter">
         <i class="fa fa-search fa-lg"></i>
         <input type="text" placeholder="digite para filtrar"
          v-model="treeFilter" class="filter-field">
      </div>
       <!--
         refs é uma propriedade usada para referenciar algum
         elemento dentro de template a partir da parte do javascript
         do componente.

         :filter="treeFilter" - passando a categoria a ser pesquisada
         para o componente Tree, pois ele, é quem terá a lógica para
         fazer a busca dentro de si.
         -->
      <Tree :data="treeData" :options="treeOptions" :filter="treeFilter"
       ref="tree"
       />
   </aside>
</template>

<script>
  import { mapState } from "vuex"
  import Tree from "liquor-tree"
  import { baseApiUrl } from "@/global"
  import axios from "axios"

   export default {
      name: "Menu",
      components: { Tree },
      /*
       Lendo o dado isMenuVisible da store, dado esse que determinará
       a visibilidade do menu, em outras palavras, mapeando atributos
       do estado da minha aplicação.
       */
      computed: mapState(['isMenuVisible']),
      data: function(){
         return {
            treeFilter: "",
            /* Dados do componente Tree, ele usará para renderizar o componente */
            treeData: this.getTreeData(),

            /* Opções para configurarmos o nosso componente liquor-tree */
            treeOptions: {
               propertyNames: {
               /*
                Mapeando o valor do nome de uma categoria para a propriedeade
                text, que é justamente o nome da propriedade que o componente
                tree espera para usar como o nome dos nodes.
               */
                 'text': 'name'
               },
               filter: {
                  /*
                   Mensagem que será exibida quando uma categoria não
                   for encontrada pela busca do meu campo de pesquisa.
                   */
                  emptyText: "Categoria não encontrada!"
               }
              
            }
         }
      },
      methods: {
         getTreeData(){
            const url = `${baseApiUrl}/categories/tree`
             return axios.get(url).then(res => res.data)
         },
         
         onNodeSelect(node){
           /*
            Fazendo uma navegação para a rota associada ao nome
            de rota articlesByCategory e passando como id da categoria o
            id do nó da árvore(tree) selecionado, essa navegação está
            sendo feito de forma programática, ou seja, sem o uso do
            componente router-link, node é justamente a categoria
            da árvore que foi selecionada ou clicacada.
            */
           this.$router.push({
             name: "articlesByCategory",
             params: {id: node.id }
           })

           if(this.$mq === 'xs' || this.$mq === 'sm'){
               this.$store.commit("toggleMenu", false)
           }

         }
      },
      mounted(){
         /*
          Vinculando um evento para cada um dos nós da minha tree, o
          evento vinculado será o de seleção de um nó, quando o nó
          for selecionado, uma navegação para a rota /categories/id/articles
          será feita, onde id será justamente o id da categoria(nó) selecionado
          */
          this.$refs.tree.$on("node:selected", this.onNodeSelect)
      }
   }
</script>

<style>
    .menu {
        grid-area: menu;
        background: linear-gradient(to right, #232526, #414345);

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }

    .menu a,
    .menu a:hover {
      color: #FFF;
      text-decoration: none;
    }

    .menu .tree-node.selected > .tree-content,
    .menu .tree-node > .tree-content:hover {
       background-color: rgba(255, 255, 255, 0.2);
    }

    .tree-arrow.has-child {
      filter: brightness(2)
    }

    .menu .menu-filter {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px;
      padding-bottom: 8px;
      border-bottom: 1px solid #AAA;
    }

    .menu .menu-filter i {
       color: #AAA;
       margin-right: 10px;
    }

    .menu input {
      color: #ccc;
      font-size: 1.2rem;
      border: none;
      outline: none;
      width: 100%;
      background-color: transparent;
    }

    div.tree-filter-empty {
      color: #ccc;
      margin-left: 20px;
      font-size: 1.3rem;
    }

    

  

       
</style>