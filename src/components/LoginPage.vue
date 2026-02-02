<template>
  <v-container fluid class="login-page fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="8" lg="6" xl="4">
        <!-- Основная карточка -->
        <v-card class="login-card" elevation="12" rounded="xl">
          <v-card-title class="text-center py-8">
            <div class="text-h4 font-weight-bold primary--text">Добро пожаловать!</div>
            <div class="text-subtitle-1 text-medium-emphasis mt-2">
              Войдите в свою учетную запись
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <!-- Форма логина -->
            <v-form @submit.prevent="handleLogin" ref="loginForm">
              <!-- Поле логина -->
              <v-text-field
                v-model="username"
                label="Имя пользователя"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                color="primary"
                :rules="[v => !!v || 'Введите имя пользователя']"
                required
                class="mb-4"
              />

              <!-- Поле пароля с глазком -->
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Пароль"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                color="primary"
                :rules="[v => !!v || 'Введите пароль']"
                required
                class="mb-2"
              />

                
              <!--<div class="d-flex align-center justify-space-between mb-6">
                <a href="#" class="text-caption text-primary text-decoration-none">
                  Забыли пароль?
                </a>
              </div>-->

              <!-- Кнопка входа -->
              <v-btn
                type="submit"
                color="rgb(190, 204, 250)"
                size="large"
                block
                :loading="loading"
                class="mb-4"
                elevation="4"
              >
                Вход
              </v-btn>
            </v-form>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>

    <!-- Декоративные элементы -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../router' // Импортируем функцию login из роутера

const router = useRouter()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Заполните все поля'
    return
  }

  loading.value = true
  errorMessage.value = ''

  // Вызов функции логина из роутера
  const isSuccess = login(username.value, password.value)

  if (isSuccess) {
    // Успешный вход - редирект на главную
    router.push('/')
  } else {
    errorMessage.value = 'Неверный логин или пароль'
  }

  loading.value = false
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

/* Анимация для иконок */
.v-btn--icon:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

/* Эффект при наведении на инпуты */
:deep(.v-field--focused) {
  border-color: rgb(190, 204, 250) !important;
}

.v-btn--primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.v-btn--primary:hover::before {
  left: 100%;
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