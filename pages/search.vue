<template>
  <section class="section">
    <section class="selection columns">
      <b-field label="Owner" class="column">
        <b-select v-model="selected.owner" placeholder="Select a owner or org">
          <option
            v-for="(option, key) in owners"
            :key="key"
            :value="option"
          >
            {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Repo" class="column">
        <b-select v-model="selected.repo" placeholder="Select a owner or org">
          <option
            v-for="(option, key) in repos"
            :key="key"
            :value="option"
          >
            {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Repo" class="column">
        <b-select v-model="selected.state" placeholder="Select a state">
          <option
            v-for="(option, key) in states"
            :key="key"
            :value="option"
          >
            {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Keywords" class="column">
        <b-input
          v-model="selected.keyword"
          type="text"
          placeholder="use space to seperate keywords"
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

const now = new Date()

export default {
  name: 'Search',
  components: {
    PullCard
  },
  data () {
    return {
      selected: {
        owner: 'pingcap',
        repo: 'tidb',
        keyword: '',
        state: 'merged',
        start: new Date(now.getTime() - 7 * 24 * 3600 * 1000),
        end: new Date()
      },
      owners: [
        'pingcap',
        'tikv'
      ],
      repos: [
        'tidb',
        'pd'
      ],
      states: [
        'all',
        'merged'
      ],
      loading: false,
      pulls: []
    }
  },
  watch: {
    'selected.owner' (val) {
      if (val === 'pingcap') {
        this.repos = [
          'tidb',
          'pd'
        ]
      } else if (val === 'tikv') {
        this.repos = [
          'tikv'
        ]
      }
      this.selected.repo = this.repos[0]
    }
  },
  methods: {
    search () {
      const data = {
        owner: this.selected.owner,
        repo: this.selected.repo,
        keyword: this.selected.keyword,
        state: this.selected.state,
        start: this.selected.start.getTime(),
        end: this.selected.end.getTime()
      }
      this.$axios
        .get('/pulls/query', {
          params: data
        })
        .then((res) => {
          const { status, data } = res.data
          if (status) {
            this.pulls = data
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
