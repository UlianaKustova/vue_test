import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

const routes = [
  {
    path: '/login', name: 'Login',
    component: () => import('../components/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  { path: '/', component: AppLayout, meta: { requiresAuth: true },
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

const AUTH_KEY = 'isAuthenticated'
let isAuthenticated = sessionStorage.getItem(AUTH_KEY) === 'true'

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Если маршрут требует авторизации и пользователь не авторизован
  if (requiresAuth && !isAuthenticated) {
    console.log('Требуется авторизация, редирект на /login')
    next('/login')
  } 
  // Если пользователь на странице логина и уже авторизован
  else if (to.path === '/login' && isAuthenticated) {
    console.log('Уже авторизован, редирект на главную')
    next('/')
  }
  // Во всех остальных случаях разрешаем
  else {
    next()
  }
})

export function login(username: string, password: string): boolean {
  console.log(`Попытка входа: ${username}`)
  
  if (username === 'admin' && password === '123') {
    isAuthenticated = true
    sessionStorage.setItem(AUTH_KEY, 'true')
    console.log('Успешный вход, состояние сохранено')
    return true
  }
  
  console.log('Неверные данные')
  return false
}

export function logout(): void {
  isAuthenticated = false
  sessionStorage.removeItem(AUTH_KEY)
  console.log('Выход, состояние очищено')
}

export function isLoggedIn(): boolean {
  return isAuthenticated
}

export default router