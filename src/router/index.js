import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import Login from '../views/Login.vue'
import Signin from '../views/Signin.vue'
import Reset from '../views/Reset.vue'
import Report from '../views/Report.vue'
import Profile from '../views/Profile.vue'
import ContactAdmin from '../views/ContactAdmin.vue'
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
    title: 'Home Page - Example App',
    meta: {
      //meta field is an additional information you can set to your route
      requiresAuth: true
    }
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: Login
  // },
  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/reset',
    name: 'Reset',
    component: Reset
  },
  {
    path: '/report/:id',
    name: 'report',
    component: Report,
    meta: {
      //meta field is an additional information you can set to your route
      requiresAuth: true
    }
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
    path: '/contactadmin',
    name: 'ContactAdmin',
    component: ContactAdmin
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
    next('/signin')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

export default router
