<template>
  <v-container fluid class="login-page fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="8" lg="6" xl="4">

        <v-card class="login-card" elevation="12" rounded="xl">
          <v-card-title class="text-center py-8">
            <div class="text-h4 font-weight-bold primary--text">Вход в систему</div>
            <div class="text-subtitle-1 text-medium-emphasis mt-2">
              Авторизуйтесь через Яндекс
            </div>
          </v-card-title>

          <v-card-text class="pa-6">

            <v-btn
              color="rgb(190, 204, 250)"
              size="large"
              block
              :loading="loading"
              @click="handleYandexLogin"
              class="mb-4 yandex-btn"
              elevation="4"
            >
              <template v-slot:prepend>
                <v-icon size="24" class="mr-2">mdi-yandex</v-icon>
              </template>
              Войти через Яндекс
            </v-btn>

            <!-- Сообщение об ошибке -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-4"
              dense
            >
              {{ errorMessage }}
            </v-alert>

          </v-card-text>

        </v-card>
      </v-col>
    </v-row>


    <div class="decoration-circle circle-1"></div>
    <div class="decoration-circle circle-2"></div>
    <div class="decoration-circle circle-3"></div>
    <div class="decoration-circle circle-4"></div>
    <div class="decoration-circle circle-5"></div>
    <div class="decoration-circle circle-6"></div>
    <div class="decoration-circle circle-7"></div>
    <div class="decoration-circle circle-8"></div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')

// OAuth Яндекс параметры
const YANDEX_OAUTH_URL = 'https://oauth.yandex.ru/authorize'
const CLIENT_ID = import.meta.env.VITE_YANDEX_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_YANDEX_REDIRECT_URI

// Проверяем, пришел ли пользователь с callback после авторизации
onMounted(() => {
  // Проверяем URL параметры на наличие кода авторизации
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const error = urlParams.get('error')
  
  if (error) {
    errorMessage.value = `Ошибка авторизации: ${error}`
    if (error === 'access_denied') {
      errorMessage.value = 'Вы отменили авторизацию'
    }
  }
  
  if (code) {
    // Если есть code, значит мы на callback странице
    exchangeCodeForToken(code)
  }
})

const handleYandexLogin = () => {
  loading.value = true
  errorMessage.value = ''
  
  // Формируем URL для OAuth авторизации
  const oauthUrl = new URL(YANDEX_OAUTH_URL)
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    force_confirm: 'yes', // Всегда запрашивать подтверждение
  }
  
  Object.entries(params).forEach(([key, value]) => {
    oauthUrl.searchParams.append(key, value)
  })
  
  // Редирект на Яндекс OAuth
  window.location.href = oauthUrl.toString()
}

// Обмен кода авторизации на токен
const exchangeCodeForToken = async (code: string) => {
  loading.value = true
  
  try {
    const response = await fetch('/api/auth/yandex/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
      })
    })
    
    if (!response.ok) {
      throw new Error('Ошибка при получении токена')
    }
    
    const data = await response.json()
    
    // Сохраняем токен (например, в localStorage или cookie)
    if (data.access_token) {
      localStorage.setItem('yandex_access_token', data.access_token)
      localStorage.setItem('yandex_refresh_token', data.refresh_token || '')
      
      // Получаем информацию о пользователе
      const userInfo = await fetchUserInfo(data.access_token)
      
      // Сохраняем информацию о пользователе
      localStorage.setItem('user_info', JSON.stringify(userInfo))
      
      // Перенаправляем на главную страницу
      router.push('/')
    }
    
  } catch (error) {
    console.error('Ошибка при обмене кода на токен:', error)
    errorMessage.value = 'Ошибка авторизации. Попробуйте еще раз.'
  } finally {
    loading.value = false
  }
}

// Получение информации о пользователе
const fetchUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch('https://login.yandex.ru/info', {
      headers: {
        'Authorization': `OAuth ${accessToken}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Ошибка при получении информации о пользователе')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Ошибка при получении информации о пользователе:', error)
    return null
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #eeeeee 0%, rgb(190, 204, 250) 100%);
  position: relative;
  overflow: hidden;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: slideUp 0.6s ease-out;
  position: relative;
  z-index: 10;
}

.yandex-btn {
  color: white !important;
  height: 56px;
  transition: transform 0.3s ease;
}

.yandex-btn:hover {
  transform: translateY(-2px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Декоративные круги */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  z-index: 0;
}

/* Позиции кругов */
.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  animation: float 20s infinite ease-in-out;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
  animation: float 25s infinite ease-in-out reverse;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 10%;
  left: 5%;
  animation: float 30s infinite ease-in-out;
}

.circle-4 {
  width: 180px;
  height: 180px;
  top: 5%;
  right: 5%;
  animation: float 22s infinite ease-in-out;
  animation-delay: 2s;
}

.circle-5 {
  width: 120px;
  height: 120px;
  bottom: 10%;
  right: 5%;
  animation: float 28s infinite ease-in-out reverse;
  animation-delay: 1s;
}

.circle-6 {
  width: 220px;
  height: 220px;
  top: 80%;
  right: -50px;
  animation: float 26s infinite ease-in-out;
  animation-delay: 3s;
}

.circle-7 {
  width: 100px;
  height: 100px;
  top: 5%;
  left: 5%;
  animation: float 24s infinite ease-in-out reverse;
  animation-delay: 4s;
}

.circle-8 {
  width: 160px;
  height: 160px;
  bottom: 5%;
  left: -40px;
  animation: float 32s infinite ease-in-out;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, 20px) rotate(90deg);
  }
  50% {
    transform: translate(0, 40px) rotate(180deg);
  }
  75% {
    transform: translate(-20px, 20px) rotate(270deg);
  }
}

/* Адаптивность */
@media (max-width: 960px) {
  .circle-1,
  .circle-2,
  .circle-3,
  .circle-4,
  .circle-5,
  .circle-6,
  .circle-7,
  .circle-8 {
    display: none;
  }
  
  .login-card {
    margin: 16px;
  }
}
</style>