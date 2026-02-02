import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

const routes = [
  {
    path: '/login', name: 'Login',
    component: () => import('../components/LoginPage.vue')
  },
  { path: '/', component: AppLayout,
    children: [
      { path: '', name: 'Home',
        component: () => import('../components/HomePage.vue')
      },
      { path: '/projects', name: 'Проекты',
        component: () => import('../components/ProjectsPage.vue')
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

let isAuthenticated = false

router.beforeEach((to, from, next) => {
  // Если идет на главную и не авторизован - на логин
  if (to.path === '/' && !isAuthenticated) {
    next('/login')
  } 
  // Если идет на логин и уже авторизован - на главную
  else if (to.path === '/login' && isAuthenticated) {
    next('/')
  }
  // Иначе просто продолжаем
  else {
    next()
  }
})

export function login(username: string, password: string): boolean {
  if (username === 'admin' && password === '123') {
    isAuthenticated = true
    console.log('вход')
    return true
  }
  console.log('Неверные данные')
  return false
}
export function logout(): void {
  isAuthenticated = false
  console.log('Выход из системы')
}

export function isLoggedIn(): boolean {
  return isAuthenticated
}

export default router