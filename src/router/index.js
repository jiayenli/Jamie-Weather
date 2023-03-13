import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: to => {
        return { path: '/taiwan-weather' }
      },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/taiwan-weather',
      name: 'taiwan-weather',
      component: HomeView
    },
    {
      path: '/world-weather',
      name: 'world-weather',
      component: HomeView
    }
  ]
})

export default router
