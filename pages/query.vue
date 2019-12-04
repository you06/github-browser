<template>
  <section class="section">
    <section class="selection columns">
      <b-field label="View" class="column">
        <b-select v-model="view" placeholder="Select a view to display">
          <option
            v-for="(option, key) in views"
            :key="key"
            :value="option"
          >
            {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Search" class="column hidden-label">
        <b-button
          type="is-info"
          @click="reload"
        >
          Reload
        </b-button>
      </b-field>
    </section>
    <section>
      <section class="result">
        <b-table :data="displayData" :columns="displayColumns" />
      </section>
    </section>
  </section>
</template>

<script>
export default {
  name: 'Query',
  components: {},
  data () {
    return {
      view: '',
      result: {
        columns: [],
        data: []
      }
    }
  },
  computed: {
    displayData () {
      return this.result.data
      // return this.result.data.map((row) => {
      //   const kvRow = {}
      //   for (let i = 0; i < row.length; i++) {
      //     kvRow[`field-${i}`] = row[i]
      //   }
      //   return kvRow
      // })
    },
    displayColumns () {
      return this.result.columns.map((item, index) => {
        return {
          field: item,
          label: item
        }
      })
    }
  },
  watch: {
    'view' (val) {
      this.reload()
    }
  },
  async asyncData ({ $axios }) {
    const r = await $axios.$get(`/db/views`)
    if (r.status) {
      return { views: r.data }
    }
    return { views: [] }
  },
  methods: {
    reload () {
      const data = {
        view: this.view
      }
      this.$axios
        .get('/db/view', {
          params: data
        })
        .then((res) => {
          const { status, data } = res.data
          if (status) {
            this.result = data
            console.log(this.result)
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
