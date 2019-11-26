import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'
import firebase from 'firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '*', //redirect every paths that does not exist to the Login view
    redirect: '/'
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      //meta field is an additional information you can set to your route
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      //meta field is an additional information you can set to your route
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      //meta field is an additional information you can set to your route
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser
  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

export default router
