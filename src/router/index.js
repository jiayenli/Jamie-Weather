import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/weather-forecast',
      name: 'weather-forecast',
      component: HomeView
    },
    {
      path: '/contact',
      name: 'contact',
      component: HomeView
    }
  ]
})
export default router
