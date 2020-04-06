<template>
  <div>
    <Toolbar></Toolbar>
    <!-- <Jumbotron></Jumbotron> -->
    <v-container fluid>
      <v-row class="mx-8">
        <v-col cols="12">
          <v-card color="#0e4d92" outlined>
            <v-row>
              <v-col cols="4">
                <div class="ml-4 welcome">Welcome back, {{ userProfile.firstName }}!</div>
                <div class="mt-2 ml-4 date-style">{{ dateToday }}</div>
              </v-col>
              <v-col>
                <div class="report-label">Total Reports</div>
                <div class="pt-1 report-stats">{{ reportsPreview.length }}</div>
              </v-col>
              <v-col>
                <div class="report-label">Pending Reports</div>
                <div class="report-stats pt-1">{{ pendingCount }}</div>
              </v-col>
              <v-col>
                <div class="report-label">Checked Reports</div>
                <div class="report-stats pt-1">{{ reportsPreview.length - pendingCount }}</div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mx-3">
        <v-col cols="3">
          <v-row justify="center">
            <v-card outlined>
              <v-date-picker
                :first-day-of-week="1"
                locale="de"
                no-title
                v-model="picker"
                color="#0e4d92"
              ></v-date-picker>
            </v-card>
          </v-row>
          <v-row class="mt-6 px-1">
            <v-col>
              <!-- <v-icon class="mr-2">mdi-filter-variant</v-icon> -->
              <div class="mb-1">
                <span class="filter">Filters</span>
                <v-btn
                  class="float-right clear-all"
                  color="#0E4D92"
                  outlined
                  @click="clearAll"
                >Clear All</v-btn>
              </div>
            </v-col>
            <v-card outlined>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <template v-slot:default="{ open }">
                      <v-row>
                        <v-col cols="4">Status</v-col>
                        <v-col cols="8" class="text--secondary">
                          <v-fade-transition leave-absolute>
                            <span v-if="open" key="0">Select report status</span>
                            <span v-else key="1">{{ statusCheck.length == 0 ? 'OFF' : 'ON' }}</span>
                          </v-fade-transition>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div v-for="stat in status" :key="stat">
                      <v-checkbox
                        v-model="statusCheck"
                        :label="stat"
                        :value="stat"
                        color="primary"
                        class="mt-n3"
                      ></v-checkbox>
                    </div>
                    <v-btn color="primary" class="float-right" @click="clearStatus" small>Clear</v-btn>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header v-slot="{ open }">
                    <v-row>
                      <v-col cols="4">Type</v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0">Select report type</span>
                          <span v-else key="1">
                            {{
                            typeCheck.length == 0 ? 'OFF' : 'ON'
                            }}
                          </span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div v-for="type in types" :key="type">
                      <v-checkbox
                        v-model="typeCheck"
                        :label="type"
                        :value="type"
                        color="primary"
                        class="mt-n2"
                      ></v-checkbox>
                    </div>
                    <v-btn color="primary" class="float-right" @click="clearType" small>Clear</v-btn>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header v-slot="{ open }">
                    <v-row>
                      <v-col cols="4">Dates</v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0">Select a range of dates</span>
                          <span v-else key="1">
                            {{
                            startDates == null || endDates == null
                            ? 'OFF'
                            : 'ON'
                            }}
                          </span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="6">
                        <v-menu
                          ref="startMenu"
                          :close-on-content-click="false"
                          :return-value.sync="startDates"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="startDates"
                              label="Start "
                              prepend-icon="mdi-calendar-month"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="date" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="$refs.startMenu.isActive = false"
                            >Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.startMenu.save(date)">OK</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>

                      <v-col cols="6">
                        <v-menu
                          ref="endMenu"
                          :close-on-content-click="false"
                          :return-value.sync="endDates"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="endDates"
                              label="End"
                              prepend-icon="mdi-calendar-month"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="date" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="$refs.endMenu.isActive = false"
                            >Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.endMenu.save(date)">OK</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <v-btn color="primary" class="float-right" @click="clearDates" small>Clear</v-btn>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header v-slot="{ open }">
                    <v-row>
                      <v-col cols="4">Time</v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0">Select a range of time</span>
                          <span v-else key="1">
                            {{
                            startTime == null || endTime == null
                            ? 'OFF'
                            : 'ON'
                            }}
                          </span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="6">
                        <v-menu
                          ref="startM"
                          :close-on-content-click="false"
                          :return-value.sync="startTime"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="startTime"
                              label="Start "
                              prepend-icon="mdi-clock-outline"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-model="startTime"
                            :max="endTime"
                            @click:minute="$refs.startM.save(startTime)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="6">
                        <v-menu
                          ref="endM"
                          :close-on-content-click="false"
                          :return-value.sync="endTime"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="endTime"
                              label="End"
                              prepend-icon="mdi-clock-outline"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-model="endTime"
                            :min="startTime"
                            @click:minute="$refs.endM.save(endTime)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <v-btn color="primary" class="float-right" @click="clearTime" small>Clear</v-btn>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="9" class="pl-4">
          <v-card outlined>
            <v-card-title>
              <span class="violation-header">Violation Reports</span>
              <v-spacer></v-spacer>
              <v-text-field
                class="mt-4"
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="reportsPreview"
              :search="search"
              :loading="loading"
              no-data-text="No Violation Reports Available"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  class="chip"
                  small
                  :color="getColor(item.status)"
                  :text-color="getTextColor(item.status)"
                  dark
                >{{ item.status }}</v-chip>
              </template>

              <template v-slot:item.date="{ item }">
                <v-icon color="#222222">mdi-calendar-month</v-icon>
                {{ showDate(item.time) }}
              </template>
              <template v-slot:item.time="{ item }">
                <v-icon color="#222222">mdi-clock-outline</v-icon>
                {{ showTime(item.time) }}
              </template>
              <template v-slot:item.show-details="{ item }">
                <v-btn
                  class="ml-4 show-btn"
                  color="#0e4d92"
                  outlined
                  small
                  @click="showReport(item)"
                >Show</v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar.vue'
//import Jumbotron from '@/components/Jumbotron.vue'
import { mapState } from 'vuex'

// const fb = require('../firebaseConfig.js')
export default {
  name: 'home',
  components: { Toolbar },
  data() {
    return {
      statusCheck: [],
      typeCheck: [],
      date: null,
      startDates: null,
      endDates: null,
      startTime: null,
      endTime: null,
      status: ['Pending', 'Accepted', 'Declined'],
      types: [
        'Parking in front of fire hydrant',
        'Parking in disabled spot',
        'Parking behind vehicles',
        'Parking over two spaces',
        'Parking against traffic direction',
        'Parking on a sidewalk',
        'Parking in a bus stop'
      ],

      color: '#19BDD3',
      picker: new Date().toISOString().substr(0, 10),
      search: '',
      headers: [
        {
          text: 'Status',
          align: 'left',
          value: 'status'
        },
        { text: 'Type', value: 'type' },
        { text: 'Date', value: 'date' },
        { text: 'Time', value: 'time' },
        { text: 'Show Details', value: 'show-details' }
      ]
    }
  },
  computed: {
    ...mapState(['userProfile', 'reportsPreview', 'loading']),
    dateToday() {
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()
      today = dd + '.' + mm + '.' + yyyy
      return today
    },
    pendingCount() {
      var count = 0
      for (var report of this.reportsPreview) {
        if (report.status === 'Pending') {
          count++
        }
      }
      return count
    }
  },
  methods: {
    getColor(status) {
      if (status == 'Pending') return 'rgb(251, 248,222)'
      else if (status == 'Approved') return 'rgb(215, 245, 234)'
      else return 'rgb(255, 236, 236)'
    },
    getTextColor(status) {
      if (status == 'Pending') return 'rgb(108, 44, 16)'
      else if (status == 'Approved') return 'rgb(22, 83, 61)'
      else return 'rgb(90, 13, 13)'
    },
    clearStatus() {
      this.statusCheck = []
    },
    clearType() {
      this.typeCheck = []
    },
    clearTime() {
      this.startTime = null
      this.endTime = null
    },
    clearDates() {
      this.startDates = null
      this.endDates = null
    },
    clearAll() {
      this.clearStatus()
      this.clearType()
      this.clearDates()
      this.clearTime()
    },
    showReport(item) {
      this.$router.push({ name: 'report', params: { id: item.index } })
    },
    showTime(time) {
      return new Date(time).toLocaleTimeString()
    },
    showDate(time) {
      return new Date(time).toLocaleDateString()
    }
  }
}
</script>
<style lang="scss" scoped>
.welcome {
  font-weight: 400;
  font-size: 20px;
  color: #fff;
}
.date-style {
  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  font-size: 17px;
  color: #fff;
}
.report-label {
  font-weight: 400;
  color: #fff;
  text-align: center;
}
.report-stats {
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
  font-size: 26px;
  color: #fff;
  text-align: center;
}
.violation-header {
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  color: #222222;
}
.filter {
  font-weight: 600;
  font-size: 20px;
  color: #222222;
}
.clear-all {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  text-transform: none;
}
.chip {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
}
.show-btn {
  font-family: 'Poppins', sans-serif;
  text-transform: none;
  color: #ffffff;
}
</style>
