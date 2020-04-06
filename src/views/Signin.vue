<template>
  <v-row justify="center" class="mt-5">
    <v-col cols="12" sm="8" md="4">
      <div class="img-container">
        <img alt="ParkRight logo" src="../assets/images/logo.svg" />
        <p class="sign-style">Sign in to ParkRight</p>
        <p class="agree-style mt-n2">By signing in you argree to terms of service</p>
      </div>
      <div v-if="performingRequest">
        <v-progress-linear indeterminate color="#FDBE10"></v-progress-linear>
      </div>
      <v-form class="mt-6" ref="formLogin">
        <span>Email</span>
        <v-text-field class="mb-0" single-line outlined v-model.trim="form.email" required></v-text-field>
        <span>Password</span>
        <v-text-field
          class="mb-n5"
          single-line
          outlined
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          v-model.trim="form.password"
          required
        ></v-text-field>
        <a class="position b-link mb-6 pt-3" @click="goToReset">Reset Password</a>
        <v-btn class="sign-btn py-6" color="#0E4D92" large block @click="login">Sign in</v-btn>
      </v-form>

      <v-snackbar
        class="snack-style"
        v-if="errorMsg !== ''"
        v-model="snackbar"
        :top="y === 'top'"
        :color="color"
        :timeout="timeout"
      >
        {{ errorMsg }}
        <v-btn dark text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <div class="text-center mt-8">
        <a class="b-link">Terms</a>
        <a class="b-link mx-6">Privacy</a>
        <a class="b-link">Contact Admin</a>
      </div>
    </v-col>
  </v-row>
</template>

<script>
const fb = require('../firebaseConfig.js')
export default {
  name: 'signin',
  data() {
    return {
      showPassword: false,
      form: {
        email: '',
        password: ''
      },
      showPassForm: false,
      performingRequest: false,
      errorMsg: '',
      color: 'error',
      snackbar: false,
      timeout: 6000,
      y: 'top'
    }
  },
  methods: {
    login() {
      if (this.$refs.formLogin.validate()) {
        this.performingRequest = true
        fb.auth
          .signInWithEmailAndPassword(this.form.email, this.form.password)
          .then(user => {
            this.$store.commit('setCurrentUser', user.user)
            this.$store.dispatch('fetchUserProfile')
            this.performingRequest = false
            this.$router.push('/home')
          })
          .catch(err => {
            console.log(err.message)
            this.performingRequest = false
            this.snackbar = true
            this.errorMsg = 'Invalid Email or Password.'
          })
      }
    },
    resetPassword() {
      if (this.$refs.formPass.validate()) {
        this.performingRequest = true
        fb.auth
          .sendPasswordResetEmail(this.passForm.email)
          .then(() => {
            this.performingRequest = false
            this.passResetSuccess = true
            this.passForm.email = ''
            this.errorMsg = ''
            this.snackbar = false
          })
          .catch(err => {
            console.log(err.message)
            this.performingRequest = false
            this.errorMsg = err.message
            this.snackbar = true
          })
      }
    },
    goToReset() {
      this.$router.push('/reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.sign-btn {
  font-weight: 500;
  color: #fff;
  font-size: 17px;
  text-transform: none;
}

.position {
  float: right;
}
</style>
