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

            <v-text-field
              v-model="clientId"
              label="Client ID"
              placeholder="Введите client_id вашего приложения перед авторизацией через Яндекс"
              variant="outlined"
              :rules="[v => !!v || 'Введите client_id']"
              required
              class="mb-4"
            />
            <!-- Кнопка для открытия Яндекс OAuth -->
            <v-btn
              color="#fc3f1d"
              size="large"
              block
              @click="openYandexAuth"
              class="mb-4 yandex-btn"
              elevation="4"
            >
              <v-icon start>mdi-yandex</v-icon>
              Открыть Яндекс для авторизации
            </v-btn>

            <!-- Форма для ввода кода и секрета -->
            <v-form @submit.prevent="handleCodeSubmit">
              <v-text-field
                v-model="verificationCode"
                label="Код подтверждения из Яндекс"
                placeholder="Вставьте код с https://oauth.yandex.ru/verification_code"
                variant="outlined"
                :rules="[v => !!v || 'Введите код']"
                required
                class="mb-4"
              />

              <v-text-field
                v-model="clientSecret"
                label="Client Secret"
                :type="showSecret ? 'text' : 'password'"
                placeholder="Введите client_secret вашего приложения"
                variant="outlined"
                :rules="[v => !!v || 'Введите client_secret']"
                required
                class="mb-4"
                :append-inner-icon="showSecret ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showSecret = !showSecret"
              />

              <v-btn
                type="submit"
                color="rgb(190, 204, 250)"
                size="large"
                block
                :loading="loading"
              >
                Получить токен
              </v-btn>
            </v-form>

            <!-- Сообщение об ошибке -->
            <v-alert v-if="errorMessage" type="error" class="mt-4" dense>
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
import { setAuthToken } from '../router'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const clientId = ref('')
const verificationCode = ref('')
const clientSecret = ref('')
const showSecret = ref(false)

onMounted(() => {
  // При загрузке проверяем, есть ли сохраненный client_id
  const savedClientId = localStorage.getItem('yandex_client_id')
  if (savedClientId) {
    clientId.value = savedClientId
  } else {
    // Если нет сохраненного, используем значение из .env
    const envClientId = import.meta.env.VITE_YANDEX_CLIENT_ID
    if (envClientId) {
      clientId.value = envClientId
    }
  }
})

const openYandexAuth = () => {
  if (!clientId.value) {
    errorMessage.value = 'Введите Client ID'
    return
  }

  // Сохраняем client_id в localStorage
  localStorage.setItem('yandex_client_id', clientId.value)

  const oauthUrl = new URL('https://oauth.yandex.ru/authorize')
  const params = {
    response_type: 'code',
    client_id: clientId.value,
  }
  
  Object.entries(params).forEach(([key, value]) => {
    oauthUrl.searchParams.append(key, value)
  })
  
  // Открываем в новой вкладке
  window.open(oauthUrl.toString(), '_blank')
}

const handleCodeSubmit = async () => {
  if (!clientId.value || !verificationCode.value || !clientSecret.value) {
    errorMessage.value = 'Заполните все поля'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // Прямой запрос к Яндекс API
    const response = await fetch('https://oauth.yandex.ru/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: verificationCode.value,
        client_id: clientId.value,
        client_secret: clientSecret.value
      })
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error_description || data.error)
    }

    if (!data.access_token) {
      throw new Error('Токен не получен')
    }

    // Сохраняем токен
    setAuthToken(data.access_token)
    
    // Сохраняем refresh token если есть
    if (data.refresh_token) {
      localStorage.setItem('yandex_refresh_token', data.refresh_token)
    }

    // Сохраняем client_secret в localStorage (по желанию)
    localStorage.setItem('yandex_client_secret', clientSecret.value)

    // Получаем информацию о пользователе
    try {
      const userResponse = await fetch('https://login.yandex.ru/info?format=json', {
        headers: {
          'Authorization': `OAuth ${data.access_token}`
        }
      })
      
      if (userResponse.ok) {
        const userInfo = await userResponse.json()
        localStorage.setItem('user_info', JSON.stringify(userInfo))
      }
    } catch (userError) {
      console.warn('Не удалось получить информацию о пользователе:', userError)
    }

    // Переходим на главную
    router.push('/')

  } catch (error) {
    console.error('Ошибка:', error)
    errorMessage.value = error instanceof Error 
      ? `Ошибка: ${error.message}` 
      : 'Неизвестная ошибка. Проверьте:<br>1. Правильность кода<br>2. Правильность client_secret<br>3. Не истекло ли время действия кода'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.yandex-btn {
  background: linear-gradient(135deg, #fc3f1d 0%, #ff6b4a 100%);
  color: white !important;
}

.yandex-btn:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}

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