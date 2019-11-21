<template>
  <div class="home">
    Home
    <v-btn @click="logout">Logout</v-btn>
  </div>
</template>

<script>
const fb = require('../firebaseConfig.js')
// @ is an alias to /src

export default {
  name: 'home',
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch('clearData')
          this.$router.push('/login')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
