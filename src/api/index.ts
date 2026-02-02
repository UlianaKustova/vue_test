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


export default api
