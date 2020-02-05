<template>
  <section class="section">
    <div style="display:inline">
      <div id="app" style="float:left">
        <v-chart :options="line" class="my-chart" />
      </div>
      <div style="float:left">
        <p>{{ this.$route.query.user }} 于 {{ this.$route.query.start }} - {{ this.$route.query.end }}，提交了 {{ created_at_cnt }} 个 pr，merge了 {{ merged_at_cnt }} 个 pr，有 {{ closed_at_cnt }} 个 pr 关闭了</p>
      </div>
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
          <a :href="`https://github.com/${props.row.owner}/${props.row.repo}/pull/${props.row.pull_id}`" target="_blank">
            {{ props.row.title }}
          </a>
        </b-table-column>
        <b-table-column field="created_at" label="Created At">
          {{ props.row.created_at }}
        </b-table-column>
        <b-table-column field="updated_at" label="Updated At">
          {{ props.row.updated_at }}
        </b-table-column>
        <b-table-column field="closed_at" label="Closed At">
          {{ props.row.closed_at }}
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
      line: { // line chart
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
      end: this.$route.query.end,
      created_at_cnt: 0,
      updated_at_cnt: 0,
      closed_at_cnt: 0,
      merged_at_cnt: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$axios
        .get('/db/pr', {
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
              updated_at: res[i].updated_at.substring(0, 10),
              closed_at: res[i].closed_at.substring(0, 10),
              merged_at: res[i].merged_at.substring(0, 10)
            }
            // if (p.merged_at === '1999-12-31') {
            //   p.merged_at = 'closed'
            // }
            this.data.push(p)
            this.created_at_cnt++
            this.updated_at_cnt++
            if (p.closed_at !== '0000-00-00') {
              this.closed_at_cnt++
            }
            if (p.merged_at !== '0000-00-00') {
              this.merged_at_cnt++
            }
            // prepare data for line chart
            if (!this.line.xAxis.data.includes(p.created_at)) {
              this.line.xAxis.data.push(p.created_at)
              this.line.series[0].data.push(1)
            } else {
              const idx = this.line.xAxis.data.indexOf(p.created_at)
              this.line.series[0].data[idx] += 1
            }
          }
          this.closed_at_cnt -= this.merged_at_cnt
        }).catch((err) => {
          console.log(err.response)
        })
    }
  }
}
</script>
