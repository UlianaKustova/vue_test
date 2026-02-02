<!-- Корневой VContainer VApp для меню VNavigation у него же есть хедер встроенные и в подвал VFooter суем -->

<template>
    <v-app style="background: linear-gradient(135deg, #ffffff 0%, rgb(190, 204, 250) 100%); min-height: 100vh;">
        <v-navigation-drawer 
        v-model="drawer"
        :rail="rail" 
        permanent@click="rail = false"
        style="background: rgba(255, 255, 255, 0);">
         <v-list>
        <v-list-item
          prepend-avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1Nrd655YtoWXW-IUp-GL1wAoLU7YLp4hBSA&s"
          :title="user.fullName"
          :subtitle="user.email"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          @click="navigateTo(item.route)"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- шапка -->
    <v-app-bar flat style="background: rgba(255, 255, 255, 0.1);">
      <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
      <v-app-bar-title>Мой сайт</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-bell </v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- тело -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app border style="background: rgba(255, 255, 255, 0);">
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          <strong>Сайт {{ new Date().getFullYear() }}</strong>
        </v-col>
      </v-row>
    </v-footer>
    </v-app>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()
const drawer = ref(true)
const rail = ref(false)

const user = ref({
  fullName: '',
  email: ''
})
const loading = ref(false)

onMounted(async () => {
  await fetchUserData()
})

async function fetchUserData() {
  loading.value = true
  try {
    console.log('here1')
    const response = await api.get('/myself')
    const userData = response.data
    console.log('here2')

    const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()

    user.value = {
      fullName: fullName || '',
      email: userData.email || 'Нет почты'
    }

  } catch (error) {
    console.error('ОШИБКА загрузки данных пользователя:', error)
  } finally {
    loading.value = false
  }
}

const menuItems = [
  { title: 'Главная', icon: 'mdi-home', value: 'home', route: '/' },
  { title: 'Проекты', icon: 'mdi-view-dashboard', value: 'Проекты', route: '/projects' },
  { title: 'hello', icon: 'mdi-email', value: 'hello', route: '/hello' },
]

function navigateTo(route: string) {
  router.push(route)
}
</script>



<style scoped>
.main-app {
  background: linear-gradient(135deg, #f5f5f5 0%, #e6ecff 100%);
  min-height: 100vh;
}

/* Иконки в шапке */
.v-btn.v-btn--icon {
  color: rgba(0, 0, 0, 0.7) !important;
  transition: all 0.3s ease !important;
}

.v-btn.v-btn--icon:hover {
  color: #1a237e !important;
  transform: translateY(-2px) !important;
  background: #f0f4ff !important;
}

/* Иконка меню в шапке */
.v-app-bar-nav-icon {
  color: #1a237e !important;
  transition: all 0.3s ease !important;
}

.v-app-bar-nav-icon:hover {
  transform: rotate(90deg) !important;
}

/* Эффект для активного пункта меню */
.v-list-item--active {
  background: rgb(200, 209, 238) !important;
}

.v-list-item--active .v-list-item-title {
  color: #1a237e !important;
  font-weight: 600 !important;
}
</style>