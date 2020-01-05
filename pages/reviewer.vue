<template>
  <section>
    <section class="selection columns">
      <b-field label="GitHub" class="column">
        <button
          @click="selected = null"
          :disabled="!selected"
          class="button field is-primary"
        >
          <span>Clear selected</span>
        </button>
      </b-field>
      <b-field label="reviewInfo" class="column">
        <button
          @click="reviewInfo"
          :disabled="!selected"
          class="button field is-info"
        >
          <span>reviewInfo</span>
        </button>
      </b-field>
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
          focusable
        />
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
          field: 'number',
          label: 'number',
          searchable: true
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
    search () {
      this.init()
    }
  }
}
</script>
