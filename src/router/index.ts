import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

const routes = [
  { path: '/', component: AppLayout,
    children: [
      { path: '', name: 'Home',
        component: () => import('../components/HomePage.vue')
      },
      { path: '/about', name: 'About',
        component: () => import('../components/AboutPage.vue')
      },
      { path: '/hello', name: 'HelloWorld',
        component: () => import('../components/HelloWorld.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router