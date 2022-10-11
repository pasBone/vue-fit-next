import Vue from 'vue'
import Fit from 'vue-fit-next'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(
  Fit({
    width: 3840,
    height: 2160,
  }),
)

new Vue({
  render: h => h(App),
}).$mount('#app')
