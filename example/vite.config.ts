import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vueVendor: ['vue']
        }
      }
    },
    chunkSizeWarningLimit: 2048
  }
})
