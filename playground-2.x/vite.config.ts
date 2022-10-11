import path from 'path'
import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
import vue from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vue-fit-next': path.resolve(__dirname, '../src/index.ts'),
    },
  },
})
