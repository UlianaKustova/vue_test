import axios from 'axios'
// import { setupInterceptors } from './interceptors'

// const url_yandex = 'https://api.tracker.yandex.net/v3/myself'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Authorization': 'OAuth ',
    'X-Cloud-Org-Id': '',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// setupInterceptors(api)

export default api
