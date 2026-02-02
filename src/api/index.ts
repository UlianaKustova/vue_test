import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { getAuthToken, removeAuthToken } from '../router'

// URL для Яндекс ID API
const YANDEX_API_URL = import.meta.env.VITE_YANDEX_API_URL || 'https://login.yandex.ru'

const api: AxiosInstance = axios.create({
  baseURL: YANDEX_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken()
    if (token && config.headers) {
      config.headers.Authorization = `OAuth ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Если 401 - токен невалидный
      removeAuthToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Пример функции для получения данных пользователя
export const getUserInfo = async () => {
  try {
    const response: AxiosResponse = await api.get('/info?format=json')
    return response.data
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error)
    throw error
  }
}

export default api




















// import axios from 'axios'
// // import { setupInterceptors } from './interceptors'

// // const url_yandex = 'https://api.tracker.yandex.net/v3/myself'

// const api = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Authorization': 'OAuth ',
//     'X-Cloud-Org-Id': '',
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// })

// // setupInterceptors(api)

// export default api
