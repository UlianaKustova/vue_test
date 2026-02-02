import api from './index'
import axios from 'axios'


export const exchangeCodeForToken = async (code: string) => {
  try {
    // Вызываем ТВОЙ бэкенд, а не напрямую Яндекс
    const response = await axios.post('/api/auth/yandex', { code })
    return response.data.access_token
  } catch (error) {
    console.error('Ошибка обмена кода:', error)
    throw error
  }
}
