import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import('../views/ProdutosView.vue'),
    },
    {
      path: '/produtos/cadastrar',
      name: 'produtos-cadastrar',
      component: () => import('../views/ProdutosCadastrarView.vue'),
    },
    {
      path: '/produtos/:id',
      name: 'produto-detalhes',
      component: () => import('../views/ProdutoDetalhesView.vue'),
      props: true,
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('../views/ClientesView.vue'),
    },
    {
      path: '/clientes/cadastrar',
      name: 'clientes-cadastrar',
      component: () => import('../views/ClientesCadastrarView.vue'),
    },
    {
      path: '/clientes/:id',
      name: 'cliente-detalhes',
      component: () => import('../views/ClienteDetalhesView.vue'),
      props: true,
    },
  ],
})

export default router
