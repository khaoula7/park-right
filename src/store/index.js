import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('../firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')
    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('setUserProfile', doc.data())
    })
    // realtime updates from our reports collection
    fb.reportsCollection
      .orderBy('sendingTime', 'desc')
      .onSnapshot(querySnapshot => {
        store.commit('setLoading', false)
        let reportsArray = []
        let reportsPrArray = []
        let counter = 0
        querySnapshot.forEach(doc => {
          //report and reportPr are objects
          let report = doc.data()
          report.id = doc.id
          let reportPr = {}
          reportPr.index = counter
          reportPr.status = report.status
          reportPr.type = report.type
          reportPr.date = report.sendingDate
          reportPr.time = report.sendingTime
          reportsArray.push(report)
          reportsPrArray.push(reportPr)
          counter++
        })
        store.commit('setReports', reportsArray)
        store.commit('setReportsPreview', reportsPrArray)
      })
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    reports: [],
    reportsPreview: [],
    selectedReport: 0,
    loading: true
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setReports(state, val) {
      state.reports = val
    },
    setReportsPreview(state, val) {
      state.reportsPreview = val
    },
    setSelectedReport(state, val) {
      state.selectedReport = val
    },
    setLoading(state, val) {
      state.loading = val
    }
  },
  actions: {
    fetchUserProfile({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit('setUserProfile', res.data())
        })
        .catch(err => {
          console.log(err)
        })
    },
    clearData({ commit }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      commit('setReports', [])
      commit('setReportsPreview', [])
    }
  }
})
