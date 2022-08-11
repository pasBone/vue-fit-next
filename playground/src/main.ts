import { createApp } from 'vue'
import Fit from 'vue-fit-next'
import App from './App.vue'

const app = createApp(App)

app
  .use(Fit({
    width: 3840,
    height: 2160,
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
