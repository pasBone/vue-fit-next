import { createApp } from 'vue'
import Fit from 'vue-fit-next'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

app
  .use(router)
  .use(Fit({
    width: 3840,
    height: 2160,
    mode: 'scale',
    animate: {
      enter: {
        duration: 500,
      },
      leave: {
        duration: 500,
      },
    },
  }))
  .mount('#app')
