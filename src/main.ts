import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify' // Файл конфигурации Vuetify будет создан автоматически

import 'vuetify/styles'

createApp(App).use(vuetify).mount('#app')
