<template>
  <section class="section">
    <b-table
      :data="data"
      :columns="columns"
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
