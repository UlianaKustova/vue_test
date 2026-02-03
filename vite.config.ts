import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // Простой вариант
      '/api': {
        target: 'https://api.tracker.yandex.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v3'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`[VITE PROXY] ${req.url} -> ${proxyReq.path}`)
          })
        }
      },
    }
  }
})
