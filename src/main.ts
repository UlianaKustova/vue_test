import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify' // Файл конфигурации Vuetify будет создан автоматически
import router from './router'
// import { vPermission } from "@/directives/permission";

import 'vuetify/styles'


createApp(App).use(vuetify).use(router).mount('#app')
