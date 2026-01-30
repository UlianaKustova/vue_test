import axios from 'axios'

// const url_yandex = 'https://api.tracker.yandex.net/v3/myself'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Authorization': '',
    'X-Cloud-Org-Id': '',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// api.interceptors.request.use(
//   (config) => {
//     // console.log(`[AXIOS REQ] ${config.method?.toUpperCase()} ${config.url}`)
//     // console.log(`Headers:`, config.headers)
//     return config
//   },
//   (error) => {
//     // console.error('[AXIOS REQ ERROR]', error)
//     return Promise.reject(error)
//   }
// )

// // Перехватчик для логирования всех ответов
// api.interceptors.response.use(
//   (response) => {
//     // console.log(`[AXIOS RES] ${response.status} ${response.config.url}`)
//     // console.log(`Data:`, response.data)
//     return response
//   },
//   (error) => {
//     // console.error(`[AXIOS RES ERROR] ${error.config?.url}`)
    
//     if (error.response) {
//       console.error(`   Status: ${error.response.status}`)
//       console.error(`   Data:`, error.response.data)
//       console.error(`   Headers:`, error.response.headers)
//     } else if (error.request) {
//       console.error('   No response received')
//       console.error('   Request:', error.request)
//     } else {
//       console.error('   Config error:', error.message)
//     }
    
//     return Promise.reject(error)
//   }
// )

export default api
