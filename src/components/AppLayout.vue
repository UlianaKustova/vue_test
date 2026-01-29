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

      <template v-slot:append>
        <v-list-item
          prepend-icon="mdi-cog"
          title="Настройки"
          value="settings"
        ></v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- Шапка сверху -->
    <v-app-bar flat>
      <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
      <v-app-bar-title>Мой сайт</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Основной контент -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <!-- Подвал -->
    <v-footer app>
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} — <strong>Сайт</strong>
        </v-col>
      </v-row>
    </v-footer>
    </v-app>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(true)
const rail = ref(false)

const menuItems = [
  { title: 'Главная', icon: 'mdi-home', value: 'home', route: '/' },
  { title: 'Главная2', icon: 'mdi-information', value: 'about', route: '/about' },
  { title: 'Главная3', icon: 'mdi-email', value: 'contacts', route: '/contacts' },
  { title: 'Главная4', icon: 'mdi-file', value: 'docs', route: '/docs' },
]

function navigateTo(route: string) {
  router.push(route)
}
</script>
