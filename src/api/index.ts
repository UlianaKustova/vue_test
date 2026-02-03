import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { getAuthToken, removeAuthToken } from '../router'

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Cloud-Org-Id': 'bpfkbh0nqr1r7jbn7oj4',
  }
})

// Интерцептор для Tracker API
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken()
    if (token && config.headers) {
      config.headers.Authorization = `OAuth ${token}`
    }
    
    // Добавляем X-Cloud-Org-Id если есть
    const orgId = localStorage.getItem('org_id')
    if (orgId && config.headers) {
      config.headers['X-Cloud-Org-Id'] = orgId
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

const yandexIdApi: AxiosInstance = axios.create({
  baseURL: '/yandex-id', // Прокси на Яндекс ID API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Интерцептор для Яндекс ID API
yandexIdApi.interceptors.request.use(
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

const setupErrorInterceptor = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        removeAuthToken()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
}

// Настраиваем интерцепторы ошибок для обоих API
setupErrorInterceptor(api)
setupErrorInterceptor(yandexIdApi)

export const getMyselfInfo = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/myself')
    return response.data
  } catch (error) {
    console.error('Ошибка Tracker API (/myself):', error)
    throw error
  }
}

export const getOrganizations = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/orgs')
    return response.data
  } catch (error) {
    console.error('Ошибка Tracker API (/orgs):', error)
    throw error
  }
}

export const getUserInfo = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await yandexIdApi.get('/info?format=json')
    return response.data
  } catch (error) {
    console.error('Ошибка Яндекс ID API (/info):', error)
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
