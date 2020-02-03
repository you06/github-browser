<template>
  <section class="section">
    <div id="app">
      <v-chart :options="line" class="my-chart" />
    </div>
    <b-table
      :data="data"
    >
      <template slot-scope="props">
        <b-table-column field="pull_id" label="Pull ID">
          {{ props.row.pull_id }}
        </b-table-column>
        <b-table-column field="user" label="User">
          {{ props.row.user }}
        </b-table-column>
        <b-table-column field="repo" label="Repo">
          {{ props.row.repo }}
        </b-table-column>
        <b-table-column field="title" label="Title">
          <a target="_blank" :href="`https://github.com/${props.row.owner}/${props.row.repo}/pull/${props.row.pull_id}`">
            {{ props.row.title }}
          </a>
        </b-table-column>
        <b-table-column field="created_at" label="Created At">
          {{ props.row.created_at }}
        </b-table-column>
        <b-table-column field="merged_at" label="Merged At">
          {{ props.row.merged_at }}
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts'
// import { getLastDayinWeek, roundTo4pm, formatDatetime } from '@/utils/datetime'
// import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
// import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
export default {
  name: 'App',
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      line: {
        title: {
          text: this.$route.query.user
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // legend: {
        //   data: ['pr_cnt', 'review_cnt']
        // },
        // grid: {
        //   left: '3%',
        //   right: '4%',
        //   bottom: '3%',
        //   containLabel: true
        // },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line'
        }]
      },
      data: [],
      // columns: [
      //   {
      //     field: 'pull_id',
      //     label: 'Pull Id'
      //   },
      //   {
      //     field: 'user',
      //     label: 'User'
      //   },
      //   {
      //     field: 'repo',
      //     label: 'Repo'
      //   },
      //   {
      //     field: 'title',
      //     label: 'Title'
      //   },
      //   {
      //     field: 'created_at',
      //     label: 'Created At'
      //   },
      //   {
      //     field: 'merged_at',
      //     label: 'Merged At'
      //   }
      // ],
      user: this.$route.query.user,
      start: this.$route.query.start,
      end: this.$route.query.end
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$axios
        .get('/db/reviewer', {
          params: {
            user: this.user,
            start: this.start,
            end: this.end
          }
        })
        .then((result) => {
          const res = result.data.data
          console.log(res)
          for (let i = 0; i < res.length; i++) {
            const p = {
              pull_id: res[i].pull_id,
              user: res[i].user,
              owner: res[i].owner,
              repo: res[i].repo,
              title: res[i].title,
              created_at: res[i].created_at.substring(0, 10),
              merged_at: res[i].merged_at.substring(0, 10)
            }
            // if (p.merged_at === '1999-12-31') {
            //   p.merged_at = 'closed'
            // }
            this.data.push(p)
            if (!this.line.xAxis.data.includes(p.created_at)) {
              this.line.xAxis.data.push(p.created_at)
              this.line.series[0].data.push(1)
            } else {
              const idx = this.line.xAxis.data.indexOf(p.created_at)
              this.line.series[0].data[idx] += 1
            }
          }
        }).catch((err) => {
          console.log(err.response)
        })
    }
  }
}
</script>
