import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

const routes = [
  {
    path: '/login', name: 'Login',
    component: () => import('../components/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('../components/AuthCallback.vue'),
    meta: { public: true }
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

const AUTH_KEY = 'yandex_token'
let isAuthenticated = !!localStorage.getItem(AUTH_KEY)

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isPublic = to.matched.some(record => record.meta.public)

  // Если маршрут требует авторизации и токена нет
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } 
  // Если публичный маршрут (логин) и уже авторизован
  else if (isPublic && isAuthenticated && to.path === '/login') {
    next('/')
  }
  // Во всех остальных случаях
  else {
    next()
  }
})

// Функции для работы с токеном
export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_KEY, token)
  isAuthenticated = true
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_KEY)
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_KEY)
  isAuthenticated = false
}

export function isLoggedIn(): boolean {
  return isAuthenticated
}

export default router