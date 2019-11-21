import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import vuetify from './plugins/vuetify'
import './assets/scss/app.scss'

const fb = require('./firebaseConfig.js')

Vue.config.productionTip = false

let app
//initialize the app only when we are sure Firebase Auth object is ready to use
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
