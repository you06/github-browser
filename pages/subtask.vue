<template>
  <section class="section">
    <section class="selection columns">
      <b-field label="Issue link" class="column">
        <b-input
          v-model="link"
          type="text"
          placeholder="paste issue link here"
        />
      </b-field>
      <b-field label="Search" class="column hidden-label">
        <b-button
          type="is-info"
          @click="search"
        >
          GO (it'll take a long time)
        </b-button>
      </b-field>
    </section>
    <section>
      <section class="result">
        <task-card
          v-for="(pull, key) in pulls"
          :key="key"
          :pull="pull"
        />
      </section>
    </section>
  </section>
</template>

<script>
import TaskCard from '@/components/TaskCard'

export default {
  name: 'Search',
  components: {
    TaskCard
  },
  data () {
    return {
      link: '',
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
        link: this.link
      }
      this.$axios
        .get('/pulls/subtask', {
          params: data
        })
        .then((res) => {
          const { status, data } = res.data
          if (status) {
            console.log(data)
            // this.pulls = data
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
