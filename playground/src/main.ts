import { createApp } from 'vue'
import Fit from 'vue-fit-next'
import App from './App.vue'

const app = createApp(App)

app
  .use(Fit({
    width: 1920,
    height: 1080,
    animate: {
      enter: {
        duration: 600,
      },
      leave: {
        duration: 600,
      },
    },
  }))
  .mount('#app')
