<template>
  <v-toolbar class="px-6">
    <v-toolbar-title>
      <router-link class="d-flex align-center park" to="/home">
        <img alt="ParkRight logo" src="../assets/images/logo.svg" />
        <span class="ml-1">ParkRight</span>
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn class="tool-item mr-4" text color="#222222" @click="goToHome">Home</v-btn>
      <v-btn class="tool-item mr-4" text color="#222222" @click="goToProfile">Profile</v-btn>
      <v-btn class="tool-item mr-4" text color="#222222" @click="goToContactAdmin">Contact Admin</v-btn>
    </v-toolbar-items>
    <v-menu :close-on-content-click="false" offset-y offset-x v-model="menu">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon x-large color="#222222">mdi-account-circle</v-icon>
        </v-btn>
      </template>
      <v-card>
        <div class="img-container px-6 py-4">
          <p class="name-style">{{ currentUser.displayName }}</p>
          <p class="email-style mt-n3">{{ currentUser.email }}</p>
          <v-btn class="signout-btn" color="#0E4D92" outlined @click="logout">Sign out</v-btn>
        </div>
        <v-divider></v-divider>
        <v-card-actions class="mx-auto">
          <v-btn class="link-sty" color="#5f6368" text @click="menu = false">Privacy Policy</v-btn>
          <span class="gb">•</span>
          <v-btn class="link-sty" color="#5f6368" text @click="menu = false">Terms of Service</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
const fb = require('../firebaseConfig.js')
import { mapState } from 'vuex'
export default {
  name: 'Toolbar',
  data() {
    return {
      menu: false
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    goToHome() {
      this.$router.push('/home')
    },
    goToProfile() {
      this.$router.push('/profile')
    },
    goToContactAdmin() {
      this.$router.push('/contactadmin')
    },
    // getName() {
    //   var user = fb.auth().currentUser
    //   console.log(user)
    //   if (user != null) {
    //     return user.displayName
    //   }
    //   return ''
    // },
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch('clearData')
          this.$router.push('/signin')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.park {
  text-decoration: none;
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 24px;
}
.tool-item {
  font-weight: 600;
  font-size: 18px;
  text-transform: none;
}
.name-style {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #222222;
  font-size: 18px;
}
.email-style {
  // font-family: 'Poppins', sans-serif;
  font-weight: 400;
  color: #808080;
}
.signout-btn {
  font-family: 'Poppins', sans-serif;
  margin: 0 auto;
  text-transform: none;
}
.link-sty {
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  text-transform: none;
  text-align: center;
}
.gb {
  color: #5f6368;
  text-align: center;
  white-space: normal;
}
</style>
