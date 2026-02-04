<template>
  <div>
    <v-card class="pa-6">
      <div class="d-flex align-center mb-4">
        <v-btn
          icon
          variant="text"
          @click="goBack"
          class="mr-3"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div>
          <v-card-title class="text-h4 pl-0"> 
            {{ project?.name || 'Загрузка...' }}
          </v-card-title>
          
          <!-- <v-card-subtitle class="pl-0">
            Ключ: {{ project?.key || '-' }}  ID: {{ projectId }}
          </v-card-subtitle> -->
        </div>
      </div>
      
      <v-divider class="my-4"></v-divider>
      
      <div v-if="loading" class="text-center pa-6">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="mt-4">Загрузка проекта...</p>
      </div>
      
      <div v-else-if="error">
        <v-alert type="error" class="ma-4">
          {{ error }}
        </v-alert>
      </div>
      
      <div v-else>
        <p>Информация о проекте:</p>
        
        <v-card class="mt-4 rounded-0" style="background-color: aliceblue;">
          <v-card-text>
            <div v-if="project">
              <p><strong>ID:</strong> {{ project.id }}</p>
              <p><strong>Название:</strong> {{ project.name }}</p>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()

interface Project {
  id: string
  name: string
  key: string
  description?: string
}

const projectName = ref('')
const projectId = ref(route.params.id)
const project = ref<Project | null>(null)
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  await fetchProjectDetails()
})

async function fetchProjectDetails() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.get(`/projects/${projectId.value}`)
    
    project.value = {
      id: response.data.id,
      name: response.data.name,
      key: response.data.key,
      description: response.data.description
    }
    
    console.log('Детали проекта загружены:', project.value)
    
  } catch (err: any) {
    console.error('Ошибка загрузки проекта:', err)
    error.value = 'Не удалось загрузить информацию о проекте'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/projects')
}
</script>

<style scoped>
.pa-6 {
  background-color: rgb(190, 204, 250);
}
</style>