<template>
  <div class="callback-page">
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-4"
          ></v-progress-circular>
          <div class="text-h6">Завершение авторизации...</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Здесь может быть логика обработки callback
  // или просто редирект на главную
  setTimeout(() => {
    router.push('/')
  }, 1000)
})
</script>