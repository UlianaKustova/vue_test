import axios from 'axios'

// const url_yandex = 'https://api.tracker.yandex.net/v3/myself'

const api = axios.create({
  baseURL: 'https://api.tracker.yandex.net/v3',
  headers: {
    'Authorization': '',
    'X-Cloud-Org-Id': ''
  }
})


export default api
