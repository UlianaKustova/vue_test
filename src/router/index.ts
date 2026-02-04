import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

const routes = [
  {
    path: '/login', name: 'Login',
    component: () => import('../components/LoginPage.vue'),
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
      {
        path: '/projects/:id',
        name: 'ProjectDetails',
        component: () => import('../components/ProjectDetailsPage.vue')
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

// для проверки авторизации
router.beforeEach((to, from, next) => {
  // Получаем метаданные маршрута
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isPublic = to.matched.some(record => record.meta.public)
  
  //проверяем актуальное состояние localStorage
  const hasToken = !!localStorage.getItem(AUTH_KEY)
  
  // маршрут требует авторизации, а токена нет
  if (requiresAuth && !hasToken) {
    next('/login')
    return
  }
  
  // если пытаемся зайти на логин, уже будучи авторизованным
  if (isPublic && hasToken && to.path === '/login') {
    next('/')
    return
  }
  
  //остальные случаи
  next()
})

// для работы с токеном
export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_KEY, token)
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_KEY)
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_KEY)
}

// всегда проверяет актуальное состояние
export function isLoggedIn(): boolean {
  return !!localStorage.getItem(AUTH_KEY)
}

export default router