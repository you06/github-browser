<template>
  <section class="section">
    <section class="selection columns">
      <!-- <b-field label="GitHub" class="column">
        <button
          :disabled="!selected"
          @click="selected = null"
          class="button field is-primary"
        >
          <span>Clear selected</span>
        </button>
      </b-field>
      <b-field label="prInfo" class="column">
        <button
          :disabled="!selected"
          @click="prInfo"
          class="button field is-info"
        >
          <span>prInfo</span>
        </button>
      </b-field> -->
      <no-ssr>
        <b-field label="Start time" class="column">
          <b-datepicker
            v-model="time.start"
            placeholder="Click to select..."
            icon="calendar-today"
          />
        </b-field>
        <b-field label="End time" class="column">
          <b-datepicker
            v-model="time.end"
            placeholder="Click to select..."
            icon="calendar-today"
          />
        </b-field>
      </no-ssr>
      <b-field label="Search" class="column hidden-label">
        <b-button
          @click="search"
          type="is-info"
        >
          Search
        </b-button>
      </b-field>
    </section>
    <b-tabs>
      <b-tab-item label="Table">
        <b-table
          :data="data"
          :selected.sync="selected"
          :paginated="true"
          :per-page="5"
          :current-page="1"
          :pagination-simple="false"
          focusable
        >
          <template slot-scope="props">
            <b-table-column field="user" label="Github Id">
              {{ props.row.user }}
            </b-table-column>
            <b-table-column field="pr_num" label="pr_num">
              <a @click="prInfo(props.row)">
                {{ props.row.pr_num }}
              </a>
            </b-table-column>
            <b-table-column field="review_num" label="review_num">
              <a @click="reviewInfo(props.row)">
                {{ props.row.review_num }}
              </a>
            </b-table-column>
          </template>
        </b-table>
      </b-tab-item>

      <b-tab-item label="Selected">
        <pre>{{ selected }}</pre>
      </b-tab-item>
    </b-tabs>
    <div id="app">
      <v-chart :options="bar" class="my-chart" />
    </div>
  </section>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts'
import { getLastDayinWeek, roundTo4pm, formatDatetime } from '@/utils/datetime'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
export default {
  name: 'App',
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      bar: {
        title: {
          text: 'sig_member'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['pr_cnt', 'review_cnt']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: []
        },
        series: [
          {
            name: 'pr_cnt',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          },
          {
            name: 'review_cnt',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'insideRight'
            },
            data: [],
            barWidth: '15px'
            // barGap: '50%',
            // barCategoryGap: '50%'
          }
        ]
      },
      data: [],
      selected: this.data,
      time: {
        start: getLastDayinWeek(4),
        end: new Date()
      }
      // columns: [
      //   {
      //     field: 'user',
      //     label: 'Github Id',
      //     searchable: true
      //   },
      //   {
      //     field: 'pr_num',
      //     label: 'pr_num',
      //     sortable: true
      //   },
      //   {
      //     field: 'review_num',
      //     label: 'review_num',
      //     sortable: true
      //   }
      // ]
    }
  },
  computed: {
    roundStart () {
      return roundTo4pm(this.time.start)
    },
    roundEnd () {
      return roundTo4pm(this.time.end)
    },
    displayStart () {
      return formatDatetime(this.roundStart)
    },
    displayEnd () {
      return formatDatetime(this.time.end)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$axios
        .get('/db/reviewers', {
          params: {
            start: this.displayStart,
            end: formatDatetime(this.time.end)
          }
        })
        .then((result) => {
          const res = result.data.data
          this.data = res
          // get the data for bar chart
          this.bar.yAxis.data = []
          this.bar.series[0].data = []
          this.bar.series[1].data = []
          for (let i = res.length - 1; i >= 0; i--) {
            if (res[i].pr_num === 0) {
              continue
            } else {
              this.bar.yAxis.data.push(res[i].user)
            }
            if (res[i].pr_num === 0) {
              continue
            } else {
              this.bar.series[0].data.push(res[i].pr_num)
            }
            if (res[i].review_num === 0) {
              continue
            } else {
              this.bar.series[1].data.push(res[i].review_num)
            }
          }
        }).catch((err) => {
          console.log(err.response)
        })
    },
    reviewInfo (row) {
      this.$router.push({ path: '/reviewInfo',
        query: {
          user: row.user,
          start: this.displayStart,
          end: formatDatetime(this.time.end)
        } })
    },
    prInfo (row) {
      this.$router.push({ path: '/prInfo',
        query: {
          user: row.user,
          start: this.displayStart,
          end: formatDatetime(this.time.end)
        } })
    },
    search () {
      this.init()
    }
  }
}
</script>
