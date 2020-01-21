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
          :columns="columns"
          :selected.sync="selected"
          @dblclick="reviewInfo()"
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
  </section>
</template>

<script>
import { getLastDayinWeek, roundTo4pm, formatDatetime } from '@/utils/datetime'
export default {
  data () {
    return {
      data: [],
      selected: this.data,
      time: {
        start: getLastDayinWeek(4),
        end: new Date()
      },
      columns: [
        {
          field: 'user',
          label: 'Github Id',
          searchable: true
        },
        {
          field: 'pr_num',
          label: 'pr_num'
        },
        {
          field: 'review_num',
          label: 'review_num'
        }
      ]
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
        }).catch((err) => {
          console.log(err.response)
        })
    },
    reviewInfo () {
      this.$router.push({ path: '/reviewInfo',
        query: {
          user: this.selected.user,
          start: this.displayStart,
          end: formatDatetime(this.time.end)
        } })
    },
    prInfo () {
      this.$router.push({ path: '/prInfo',
        query: {
          user: this.selected.user,
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
