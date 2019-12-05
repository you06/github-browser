<template>
  <section class="section">
    <section class="selection columns">
      <b-field label="GitHub" class="column">
        <b-input
          v-model="selected.github"
          type="text"
          placeholder="your github account"
        />
      </b-field>
      <no-ssr>
        <b-field label="Start time" class="column">
          <b-datepicker
            v-model="selected.start"
            placeholder="Click to select..."
            icon="calendar-today"
          />
        </b-field>
        <b-field label="End time" class="column">
          <b-datepicker
            v-model="selected.end"
            placeholder="Click to select..."
            icon="calendar-today"
          />
        </b-field>
      </no-ssr>
      <b-field label="Search" class="column hidden-label">
        <b-button
          type="is-info"
          @click="search"
        >
          Search
        </b-button>
      </b-field>
    </section>
    <section>
      <p>{{ selected.github }} reviewed {{ pulls.length }} during {{ displayStart }} - {{ displayEnd }}</p>
      <p>
        If you can not find some repos here, following this <a href="https://internal.pingcap.net/confluence/pages/viewpage.action?pageId=71177213" target="_blank">guide</a> to add repos.
      </p>
      <section class="result">
        <pull-card
          v-for="(pull, key) in pulls"
          :key="key"
          :pull="pull"
        />
      </section>
    </section>
  </section>
</template>

<script>
import PullCard from '@/components/PullCard'
import { getLastDayinWeek, roundTo4pm, formatDatetime } from '@/utils/datetime'

export default {
  name: 'Review',
  components: {
    PullCard
  },
  data () {
    return {
      selected: {
        github: '',
        start: getLastDayinWeek(4),
        end: new Date()
      },
      loading: false,
      pulls: []
    }
  },
  computed: {
    roundStart () {
      return roundTo4pm(this.selected.start)
    },
    roundEnd () {
      return roundTo4pm(this.selected.end)
    },
    displayStart () {
      return formatDatetime(this.roundStart)
    },
    displayEnd () {
      return formatDatetime(this.selected.end)
    }
  },
  methods: {
    search () {
      if (this.selected.github === '') {
        return
      }
      const data = {
        github: this.selected.github,
        start: this.displayStart,
        end: formatDatetime(this.selected.end)
      }
      this.$axios
        .get('/db/review', {
          params: data
        })
        .then((res) => {
          const { status, data } = res.data
          if (status) {
            this.pulls = data.map((pull) => {
              const p = {
                title: pull.title,
                user: {
                  login: pull.user
                },
                owner: pull.owner,
                repo: pull.repo,
                number: pull.pull_number,
                created_at: pull.created_at,
                html_url: `https://github.com/${pull.owner}/${pull.repo}/pull/${pull.pull_number}`
              }
              if (pull.status === 'closed') {
                p.closed_at = pull.closed_at
              }
              if (pull.status === 'merged') {
                p.merged_at = pull.merged_at
              }
              return p
            })
          }
        })
        .catch((reason) => {
          console.log(reason)
        })
    }
  }
}
</script>

<style lang="stylus">
.hidden-label
  label
    color transparent
    user-select none
</style>
