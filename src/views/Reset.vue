<template>
  <v-row justify="center" class="mt-5">
    <v-col cols="12" sm="8" md="4">
      <div class="img-container">
        <img alt="ParkRight logo" src="../assets/images/logo.svg" />
        <p class="sign-style">Reset your password</p>
        <p
          class="agree-style mt-n2"
          v-if="!passResetSuccess"
        >We will send you an email to reset your password.</p>
        <p v-else class="agree-style">
          Check your email for a link to reset your password. If it doesn't
          appear within a few minutes, check your spam folder.
        </p>
      </div>
      <div v-if="performingRequest">
        <v-progress-linear indeterminate color="#FDBE10"></v-progress-linear>
      </div>
      <v-form class="mt-6" ref="formPass">
        <div v-if="!passResetSuccess">
          <span>Email</span>
          <v-text-field single-line outlined v-model.trim="passForm.email" required></v-text-field>
          <v-btn
            class="sign-btn py-6"
            color="#0E4D92"
            large
            block
            @click="resetPassword"
          >Send password reset email</v-btn>
        </div>
        <div v-else>
          <v-btn color="#0E4D92" outlined large block @click="goToSignIn">Return to Sign in</v-btn>
        </div>
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
    </v-col>
  </v-row>
</template>

<script>
const fb = require('../firebaseConfig.js')
export default {
  name: 'reset',
  data() {
    return {
      passForm: {
        email: ''
      },
      passResetSuccess: false,
      performingRequest: false,
      errorMsg: '',
      color: 'error',
      snackbar: false,
      timeout: 6000,
      y: 'top'
    }
  },
  methods: {
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
    goToSignIn() {
      this.$router.push('/signin')
    }
  }
}
</script>

<style lang="scss" scoped>
.sign-btn {
  font-family: 'Open Sans', sans-serif;
  font-weight: 500;
  color: #fff;
  font-size: 17px;
  text-transform: none;
}
</style>
