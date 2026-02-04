<template>
  <div>
    <v-card class="pa-6">
      <v-card-title class="text-h4">Проекты</v-card-title>
      <v-card-subtitle>Список ваших проектов</v-card-subtitle>
      
      <v-divider class="my-4"></v-divider>
      
      <div v-if="loading" class="text-center pa-6">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="mt-4">Загрузка....</p>
      </div>

      <div v-else-if="error">
        <v-alert type="error" class="ma-4">
          {{ error }}
        </v-alert>
      </div>

      <div v-else>
        <v-list>
          <v-list-item
            v-for="project in projects"
            :key="project.id"
            @click="selectProject(project)"
            class="project-item"
          >
            <v-list-item-title>
              {{ project.name }}
            </v-list-item-title>
            <template v-slot:append>
              <v-chip small class="ml-2">Перейти к {{ project.key }}</v-chip>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useRouter } from 'vue-router'

interface Project {
  id: string
  name: string
  key: string
}

const projects = ref<Project[]>([])
const loading = ref(false)
const error = ref('')
const router = useRouter()

onMounted(async () => {
  await fetchProjects()
})

async function fetchProjects() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.get('/projects')
    
    projects.value = response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      key: item.key
    }))
    
    console.log('Загружено проектов:', projects.value.length)
    
  } catch (err: any) {
    console.error('Ошибка загрузки проектов:', err)
    error.value = 'Не удалось загрузить проекты'
  } finally {
    loading.value = false
  }
}

function selectProject(project: Project) {
  router.push(`/projects/${project.id}`)
}
</script>

<style scoped>
.project-item {
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.project-item:hover {
  background-color: aliceblue;
}

.pa-6 {
  background-color: rgb(190, 204, 250);
}
</style>