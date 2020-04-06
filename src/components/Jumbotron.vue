<template>
  <v-container class="jumbo-style">
    <v-row no-gutters>
      <v-col cols="4">
        <div class="headline pl-3">
          Welcome back, {{ userProfile.firstName }}!
        </div>
        <div class="title font-weight-light pt-2 pl-3">{{ date }}</div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="vertical-line">
        <div>Total Reports</div>
        <div class="display-1 font-weight-light pt-1">{{ reports.length }}</div>
      </v-col>

      <v-col class="vertical-line">
        <div>Pending Reports</div>
        <div class="font-weight-light display-1 pt-1">{{ pendingCount }}</div>
      </v-col>

      <v-col>
        <div>Checked Reports</div>
        <div class="font-weight-light display-1 pt-1">
          {{ reports.length - pendingCount }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Jumbotron',
  data() {
    return {}
  },
  computed: {
    ...mapState(['userProfile', 'reports']),
    date() {
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()
      today = dd + '.' + mm + '.' + yyyy
      return today
    },
    pendingCount() {
      var count = 0
      for (var report of this.reports) {
        if (report.status == 'Pending') {
          count++
        }
      }
      return count
    }
  }
}
</script>

<style lang="scss" scoped>
.jumbo-style {
  background-image: linear-gradient(to right, #015495, #19bdd3);
  color: white;
}
.vertical-line {
  border-right: 1px solid #53bfd6;
  height: 75px;
  margin-right: 24px;
}
</style>
