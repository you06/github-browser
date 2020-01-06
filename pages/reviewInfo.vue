<template>
  <section class="section">
    <b-table
      :data="data"
      :columns="columns"
    />
  </section>
</template>

<script>
export default {
  data () {
    return {
      data: [],
      columns: [
        {
          field: 'pull_id',
          label: 'Pull Id'
        },
        {
          field: 'user',
          label: 'User'
        },
        {
          field: 'repo',
          label: 'Repo'
        },
        {
          field: 'title',
          label: 'Title'
        },
        {
          field: 'created_at',
          label: 'Created At'
        },
        {
          field: 'merged_at',
          label: 'Merged At'
        }
      ],
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
              repo: res[i].repo,
              title: res[i].title,
              created_at: res[i].created_at.substring(0, 10),
              merged_at: res[i].merged_at.substring(0, 10)
            }
            this.data.push(p)
          }
        }).catch((err) => {
          console.log(err.response)
        })
    }
  }
}
</script>
