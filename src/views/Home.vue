<template>
  <div>
    <Toolbar></Toolbar>
    <Jumbotron></Jumbotron>
    <v-container fluid>
      <v-row>
        <v-col cols="3">
          <v-row justify="center">
            <v-date-picker
              :first-day-of-week="1"
              locale="de"
              no-title
              v-model="picker"
              color="primary"
            ></v-date-picker>
          </v-row>
          <v-row>
            <v-col class="mt-4 ml-1">
              <v-icon class="mr-2">mdi-filter-variant</v-icon>
              <span class="grey--text text--darken-1 font-weight-regular title"
                >Filters</span
              >
              <v-btn
                class="float-right"
                tile
                outlined
                color="grey darken-1"
                @click="clearAll"
                >Clear All</v-btn
              >
            </v-col>
            <v-expansion-panels class="mx-2">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row>
                      <v-col cols="4">Status</v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0">Select report status</span>
                          <span v-else key="1">
                            {{ statusCheck.length == 0 ? 'OFF' : 'ON' }}
                          </span>
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
                    ></v-checkbox>
                  </div>
                  <v-btn
                    color="primary"
                    class="float-right"
                    @click="clearStatus"
                    >Clear</v-btn
                  >
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row>
                    <v-col cols="4">Type</v-col>
                    <v-col cols="8" class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <span v-if="open" key="0">Select report type</span>
                        <span v-else key="1">{{
                          typeCheck.length == 0 ? 'OFF' : 'ON'
                        }}</span>
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
                    ></v-checkbox>
                  </div>
                  <v-btn color="primary" class="float-right" @click="clearType"
                    >Clear</v-btn
                  >
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
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.startMenu.save(date)"
                            >OK</v-btn
                          >
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
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.endMenu.save(date)"
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-btn color="primary" class="float-right" @click="clearDates"
                    >Clear</v-btn
                  >
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
                            startTime == null || endTime == null ? 'OFF' : 'ON'
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
                  <v-btn color="primary" class="float-right" @click="clearTime"
                    >Clear</v-btn
                  >
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-col>
        <v-col cols="9">
          <v-card>
            <v-card-title>
              Violation Reports
              <v-spacer></v-spacer>
              <v-text-field
                class="mt-5"
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
                <v-chip :color="getColor(item.status)" dark>
                  {{ item.status }}
                </v-chip>
              </template>
              <!-- <template v-slot:item.type="{ item }">
                <span :style="{ color: getColor(item.status) }">{{
                  item.type
                }}</span>
              </template>-->
              <template v-slot:item.date="{ item }">
                <v-icon>mdi-calendar-month</v-icon>
                {{ item.date }}
              </template>
              <template v-slot:item.time="{ item }">
                <v-icon>mdi-clock-outline</v-icon>
                {{ item.time }}
              </template>
              <template v-slot:item.show-details="{ item }">
                <v-btn color="primary" small @click="showReport(item)"
                  >Show</v-btn
                >
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
import Jumbotron from '@/components/Jumbotron.vue'
import { mapState } from 'vuex'

// const fb = require('../firebaseConfig.js')
export default {
  name: 'home',
  components: { Toolbar, Jumbotron },
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
        { text: 'Time', value: 'time' },
        { text: 'Date', value: 'date' },
        { text: 'Show Details', value: 'show-details' }
      ]
    }
  },
  computed: {
    ...mapState(['reportsPreview', 'loading'])
  },
  methods: {
    getColor(status) {
      if (status == 'Pending') return '#19BDD3'
      else if (status == 'Accepted') return '#77CE05'
      else return '#015495'
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
      console.log(item.index)
    }
  }
}
</script>
