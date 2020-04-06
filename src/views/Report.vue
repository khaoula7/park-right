<template>
  <div>
    <Toolbar></Toolbar>
    <Jumbotron></Jumbotron>
    <v-container>
      <v-row>
        <v-col cols="7">
          <v-card outlined>
            <v-row class="pa-5">
              <v-col>
                <div class="overline mb-2 grey--text text--darken-2">
                  VIOLATION TYPE
                </div>
                <div class="headline mb-5">{{ reports[id].type }}</div>
                <div class="d-flex flex-row">
                  <div class="mr-5">
                    <v-icon class="mr-1">mdi-calendar-month</v-icon>
                    <span>{{ showSendingDate }}</span>
                  </div>
                  <div>
                    <v-icon class="mr-1">mdi-clock-outline</v-icon>
                    <span>{{ showSendingTime }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters class="py-5">
              <v-list-item>
                <v-list-item-content>
                  <div class="overline mb-2">VIOLATION PHOTOS</div>
                </v-list-item-content>
              </v-list-item>
              <v-carousel>
                <v-carousel-item
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                  :src="getFirstUrl"
                ></v-carousel-item>
                <v-carousel-item
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                  :src="getSecondUrl"
                ></v-carousel-item>
                <v-carousel-item
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                  :src="getThirdUrl"
                ></v-carousel-item>
              </v-carousel>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters class="pt-5 pb-6">
              <v-list-item>
                <v-list-item-content>
                  <div class="overline mb-2">VIOLATION ADRESSE</div>
                </v-list-item-content>
              </v-list-item>
              <GmapMap :center="center" :zoom="10" class="map">
                <GmapMarker
                  :position="{
                    lat: getLatitude,
                    lng: getLongitude
                  }"
                  :clickable="true"
                  :draggable="true"
                  @click="
                    center = {
                      lat: getLatitude,
                      lng: getLongitude
                    }
                  "
                />
              </GmapMap>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="5">
          <v-card elevation="1" class="pa-5">
            <v-row>
              <v-col>
                <div class="overline mb-2 grey--text text--darken-2">
                  VIOLATION STATUS
                </div>
                <div class="headline mb-2">{{ reports[id].status }}</div>
              </v-col>
              <v-dialog
                v-if="reports[id].status === 'Pending'"
                v-model="dialog"
                persistent
                max-width="600px"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    style="text-transform: none;"
                    class="float-right"
                    color="primary"
                    dark
                    v-on="on"
                    >Decide Now</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline mx-auto">Municipality Decision</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-select
                              :items="decisions"
                              label="Select Decision"
                              outlined
                              :rules="[v => !!v || 'Decision is required']"
                              v-model="form.decision"
                              @change="showDecReason"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="10" class="mt-n9">
                            <v-select
                              v-show="showReason"
                              :items="reasons"
                              item-text="label"
                              label="Select Reason"
                              outlined
                              :rules="
                                showReason
                                  ? [v => !!v || 'Reason is required']
                                  : []
                              "
                              v-model="form.reason"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="2" class="mt-n6">
                            <v-btn
                              v-show="showReason"
                              color="primary"
                              small
                              :disabled="disabled"
                              @click="newBtnClick"
                              >New</v-btn
                            >
                          </v-col>
                          <v-col cols="12" sm="10" class="mt-n8">
                            <v-textarea
                              v-show="showNewReason"
                              outlined
                              label="Enter new reason"
                              :rows="rows"
                              v-model="form.newReason"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" sm="2" class="mt-n6">
                            <v-btn
                              v-show="showNewReason"
                              color="primary"
                              small
                              @click="addBtnClick"
                              >Add</v-btn
                            >
                          </v-col>
                          <v-col cols="12" class="mt-n8">
                            <v-select
                              :items="types"
                              label="Confirm Violation Type"
                              outlined
                              v-model="form.type"
                              :rules="[
                                v => !!v || 'Type confirmation is required'
                              ]"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" class="mt-n10">
                            <v-text-field
                              v-show="showTicket"
                              label="Enter Ticket number"
                              required
                              v-model="form.ticket"
                              :rules="
                                showTicket
                                  ? [v => !!v || 'Ticket number is required']
                                  : []
                              "
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" class="mt-n8">
                            <v-text-field
                              v-show="showTicket"
                              label="Enter Car Licence"
                              required
                              v-model="form.licence"
                              :rules="
                                showTicket
                                  ? [v => !!v || 'Car licence is required']
                                  : []
                              "
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="mt-n10 pb-4 mr-7">
                    <v-spacer></v-spacer>
                    <v-btn text class="mr-5 px-2" color="error" @click="reset"
                      >Cancel</v-btn
                    >
                    <v-btn
                      :disabled="!valid"
                      class="px-3"
                      color="primary"
                      @click="validate"
                      >Save</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
            <v-row no-gutters v-if="reports[id].status === 'Approved'">
              <div class="d-flex pt-1">
                <div>
                  <v-icon class="mr-1">mdi-calendar-month</v-icon>
                  <span>{{ showDecisionDate }}</span>
                </div>
                <div>
                  <v-icon class="ml-5 mr-1">mdi-clock-outline</v-icon>
                  <span>{{ showDecisionTime }}</span>
                </div>
              </div>
            </v-row>
            <v-row no-gutters v-if="reports[id].status === 'Approved'">
              <div>
                <div class="overline mb-2 mt-7 grey--text text--darken-2">
                  TICKET NUMBER
                </div>
                <div class="text_size">{{ reports[id].ticket }}</div>
                <div class="overline mb-2 mt-5 grey--text text--darken-2">
                  LICENCE NUMBER
                </div>
                <div class="text_size">{{ reports[id].licence }}</div>
              </div>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Toolbar from '@/components/Toolbar.vue'
import Jumbotron from '@/components/Jumbotron.vue'
const fb = require('../firebaseConfig.js')
export default {
  name: 'report',
  components: { Toolbar, Jumbotron },
  data() {
    return {
      id: 0,
      dialog: false,
      rows: 2,
      clearable: true,
      disabled: false,
      valid: true,
      form: {
        decision: null,
        type: null,
        reason: null,
        newReason: '',
        ticket: '',
        licence: ''
      },
      showReason: false,
      showNewReason: false,
      showTicket: false,
      center: {
        //Abu dhabi coordinates
        lat: 24.4539,
        lng: 54.3773
      },
      decisions: ['Approved', 'Declined'],
      types: [
        'Parking in front of fire hydrant',
        'Parking in disabled spot',
        'Parking behind vehicles',
        'Parking over two spaces',
        'Parking against traffic direction',
        'Parking on a sidewalk',
        'Parking in a bus stop'
      ],
      reasons: []
    }
  },
  created() {
    this.id = this.$route.params.id
    fb.reasonsCollection.onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.reasons.push(doc.data())
      })
    })
  },
  computed: {
    ...mapState(['reports']),
    getFirstUrl() {
      return this.reports[this.id].firstImageUrl
    },
    getSecondUrl() {
      return this.reports[this.id].secondImageUrl
    },
    getThirdUrl() {
      return this.reports[this.id].thirdImageUrl
    },
    getLatitude() {
      return this.reports[this.id].latitude
    },
    getLongitude() {
      return this.reports[this.id].longitude
    },
    showSendingDate() {
      return new Date(this.reports[this.id].sendingTime).toLocaleDateString()
    },
    showSendingTime() {
      return new Date(this.reports[this.id].sendingTime).toLocaleTimeString()
    },
    showDecisionDate() {
      return new Date(this.reports[this.id].decisionTime).toLocaleDateString()
    },
    showDecisionTime() {
      return new Date(this.reports[this.id].decisionTime).toLocaleTimeString()
    }
  },
  methods: {
    showDecReason() {
      if (this.form.decision == 'Declined') {
        this.showReason = true
        this.showTicket = false
      } else {
        this.showTicket = true
        this.showReason = false
        this.showNewReason = false
      }
    },
    newBtnClick() {
      this.showNewReason = true
      this.disabled = true
    },
    addBtnClick() {
      if (this.form.newReason != '') {
        // Add a new document with a generated id.
        fb.reasonsCollection
          .add({ label: this.form.newReason })
          .then(function(docRef) {
            console.log('Document written with ID: ', docRef.id)
          })
          .catch(function(error) {
            console.error('Error adding document: ', error)
          })
        this.form.reason = this.form.newReason
        this.form.newReason = ''
        this.showNewReason = false
        this.disabled = false
      }
    },

    validate() {
      if (this.$refs.form.validate()) {
        var reportRef = fb.reportsCollection.doc(this.reports[this.id].id)
        reportRef
          .update({
            status: this.form.decision,
            type: this.form.type,
            ticket: this.form.ticket,
            licence: this.form.licence,
            declineReason: this.form.reason,
            decisionTime: Date.now()
          })
          .then(function() {
            console.log('Document successfully updated!')
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error('Error updating document: ', error)
          })
        this.dialog = false
      }
    },
    reset() {
      this.$refs.form.reset()
      this.showReason = false
      this.showNewReason = false
      this.disabled = false
      this.showTicket = false
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.border-style {
  border-left: 1px solid #bdbdbd;
  padding-right: 24px;
}
.map {
  width: 100%;
  height: 500px;
}
.text_size {
  font-size: 18px;
}
</style>
