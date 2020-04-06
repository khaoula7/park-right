import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import './assets/scss/app.scss'
import vuetify from './plugins/vuetify'
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAisIlITIxCckjOsCreb7N_c0QQFySqVTQ',
    libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
    //// If you want to set the version, you can do so:
    // v: '3.26',
  }
  // // If you intend to programmatically custom event listener code
  // // (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  // // instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  // // you might need to turn this on.
  // autobindAllEvents: false,

  // // If you want to manually install components, e.g.
  // // import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  // // Vue.component('GmapMarker', GmapMarker)
  // // then disable the following:
  // installComponents: true,
})

const fb = require('./firebaseConfig.js')

Vue.config.productionTip = false

let app
//initialize the app only when we are sure Firebase Auth object is ready to use
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      vuetify,
      render: h => h(App)
    })
  }
})
