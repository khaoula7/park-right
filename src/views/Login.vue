<template>
  <v-row justify="center" class="mt-5">
    <v-col cols="12" sm="8" md="4">
      <v-card class="mt-12" outlined v-if="showLoginForm">
        <div v-if="performingRequest">
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </div>
        <v-card-title>
          <h1 class="headline">Login to ParkRight Portal</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="formLogin" class="mb-5" v-model="validLogin" lazy-validation>
            <v-text-field
              prepend-icon="mdi-email"
              label="Email"
              v-model.trim="form.email"
              :rules="emailRules"
              required
            ></v-text-field>
            <v-text-field
              prepend-icon="mdi-lock"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              v-model.trim="form.password"
              required
              :rules="[v => !!v || 'Password is required']"
            ></v-text-field>
            <a style="float:right;" class="b-link" @click="togglePasswordReset">Reset Password</a>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn :disabled="!validLogin" color="info" large block @click="login">Login</v-btn>
        </v-card-actions>
        <v-snackbar
          v-if="errorMsg !== ''"
          v-model="snackbar"
          :top="y === 'top'"
          :color="color"
          :timeout="timeout"
        >
          {{ errorMsg }}
          <v-btn dark text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-card>

      <v-card class="mt-12 elevation-1" v-if="showPassForm">
        <div v-if="performingRequest">
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </div>
        <v-card-title>
          <h1 v-if="!passResetSuccess" class="headline">Reset Password</h1>
          <h1 v-else class="headline">Email Sent</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="formPass" v-model="validPass" lazy-validation>
            <div v-if="!passResetSuccess">
              <p class="body-1">We will send you an email to reset your password</p>
              <v-text-field
                prepend-icon="mdi-email"
                label="Email"
                v-model.trim="passForm.email"
                class="mt-1"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-card-actions>
                <a class="body-2 b-link" @click="togglePasswordReset">Back to login</a>
                <v-spacer></v-spacer>
                <v-btn :disabled="!validPass" color="info" @click="resetPassword">Submit</v-btn>
              </v-card-actions>
            </div>
            <div v-else>
              <p class="body-1">Check your email for a link to reset your password</p>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="togglePasswordReset" color="info">Back to login</v-btn>
              </v-card-actions>
            </div>
          </v-form>
        </v-card-text>
        <v-snackbar
          v-if="errorMsg !== ''"
          v-model="snackbar"
          :top="y === 'top'"
          :color="color"
          :timeout="timeout"
        >
          {{ errorMsg }}
          <v-btn dark text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-card>

      <div class="text-center mt-4">
        <a class="body-1 b-link">Contact Administrator</a>
      </div>
      <div class="text-center mt-3">
        <a class="body-1 b-link">Terms and Conditions</a>
      </div>
    </v-col>
  </v-row>
</template>

<script>
const fb = require('../firebaseConfig.js')
export default {
  name: 'login',
  data() {
    return {
      showPassword: false,
      validLogin: true,
      validPass: true,
      form: {
        email: '',
        password: ''
      },
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passForm: {
        email: ''
      },
      showLoginForm: true,
      showPassForm: false,
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
    togglePasswordReset() {
      if (this.showPassForm) {
        this.showLoginForm = true
        this.showPassForm = false
        this.passResetSuccess = false
      } else {
        this.showLoginForm = false
        this.showPassForm = true
      }
    },
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
            console.log(err)
            this.performingRequest = false
            this.snackbar = true
            this.errorMsg = err.message
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
            console.log(err)
            this.performingRequest = false
            this.errorMsg = err.message
            this.snackbar = true
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
