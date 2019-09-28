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
        <div
          v-for="(pull, key) in pulls"
          :key="key"
          class="pull-info-item"
        >
          <p>
            <a
              :href="`https://github.com/${pull.user.login}`"
              target="_blank"
              class="info-line-block"
            >
              <b-icon
                icon="account"
                size="is-small"
              />
              {{ pull.user.login }}
            </a>
            <span class="info-line-block">
              <b-icon
                icon="clock"
                size="is-small"
              />
              created: {{ formatDate(new Date(pull.created_at)) }}
            </span>
            <span v-if="pull.merged_at" class="info-line-block">
              <b-icon
                icon="check"
                size="is-small"
              />
              merged: {{ formatDate(new Date(pull.merged_at)) }}
            </span>
            <span v-if="!pull.merged_at && pull.closed_at" class="info-line-block">
              <b-icon
                icon="cross"
                size="is-small"
              />
              closed: {{ formatDate(new Date(pull.closed_at)) }}
            </span>
          </p>
          <a :href="pull.html_url" target="_blank">
            {{ pull.title }}
          </a>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
const { formatDate } = require('@/utils/datetime')

const now = new Date()

export default {
  name: 'Search',
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
    formatDate,
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

.pull-info-item
  border-radius 2px
  border 1px solid #7957d5
  padding 10px 5px
  margin-top 5px
  &:first-child
    margin-top 0
  .info-line-block
    display inline-block
    width 200px
</style>
