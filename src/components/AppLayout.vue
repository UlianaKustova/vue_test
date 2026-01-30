<!-- Корневой VContainer VApp для меню VNavigation у него же есть хедер встроенные и в подвал VFooter суем -->

<template>
    <v-app>
        <v-navigation-drawer 
        v-model="drawer"
        :rail="rail" 
        permanent@click="rail = false">
         <v-list>
        <v-list-item
          prepend-avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1Nrd655YtoWXW-IUp-GL1wAoLU7YLp4hBSA&s"
          title="Паничка Атаковна"
          subtitle="aaaa@post.com"
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
    <v-app-bar flat>
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

    <v-footer app border>
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

// const user = ref({
//   fullName: '',
//   email: ''
// })
const loading = ref(false)

onMounted(async () => {
  await fetchUserData()
})

async function fetchUserData() {
  loading.value = true
  try {
    console.log('here1')
    const response = await api.get('/myself')
    console.log('here2')
    console.log(response)

  } catch (error) {
    console.error('ОШИБКА загрузки данных пользователя:', error)
  } finally {
    loading.value = false
  }
}

const menuItems = [
  { title: 'Главная', icon: 'mdi-home', value: 'home', route: '/' },
  { title: 'about', icon: 'mdi-information', value: 'about', route: '/about' },
  { title: 'hello', icon: 'mdi-email', value: 'hello', route: '/hello' },
]

function navigateTo(route: string) {
  router.push(route)
}
</script>
