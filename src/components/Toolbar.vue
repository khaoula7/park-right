<template>
  <v-toolbar flat dense>
    <v-toolbar-title>
      <span class="park pr-1">PARK</span>
      <span class="right">RIGHT</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu
      open-on-hover
      close-on-click
      close-on-content-click
      offset-x
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon x-large>mdi-account-circle</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="go(index)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
const fb = require('../firebaseConfig.js')
export default {
  name: 'Toolbar',
  data() {
    return {
      items: [{ title: 'Profile' }, { title: 'Settings' }, { title: 'Logout' }]
    }
  },
  methods: {
    go(index) {
      console.log(index)
      if (index == 2) {
        fb.auth
          .signOut()
          .then(() => {
            this.$store.dispatch('clearData')
            this.$router.push('/login')
          })
          .catch(err => {
            console.log(err)
          })
      } else if (index == 1) {
        this.$router.push('/settings')
      } else {
        this.$router.push('/profile')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.park,
.right {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
}
.park {
  color: #015495;
}
.right {
  color: #19bdd3;
}
</style>
