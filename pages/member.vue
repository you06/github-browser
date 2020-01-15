<template>
  <section class="section">
    <button
      :disabled="!selected"
      class="button field is-primary"
      @click="selected = null"
    >
      <span>Clear selected</span>
    </button>
    <button
      class="button field is-success"
      to="./add_member"
      @click="add"
    >
      <span>Add</span>
    </button>
    <button
      :disabled="!selected"
      class="button field is-info"
      @click="edit"
    >
      <span>edit</span>
    </button>
    <button
      :disabled="!selected"
      class="button field is-danger"
      @click="deleteRow"
    >
      <span>delete</span>
    </button>

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
export default {
  data () {
    return {
      data: [],
      selected: this.data,
      columns: [
        {
          field: 'github_id',
          label: 'Github Id',
          searchable: true
        },
        {
          field: 'organization',
          label: 'Organization',
          searchable: true
        },
        {
          field: 'email',
          label: 'Email',
          searchable: true
        },
        {
          field: 'slack_id',
          label: 'Slack Id',
          searchable: true
        },
        {
          field: 'group_name',
          label: 'Group Name',
          searchable: true
        },
        {
          field: 'role',
          label: 'Role',
          searchable: true
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$axios
        .get('/db/members')
        .then((result) => {
          const res = result.data.data
          this.data = res
        }).catch((err) => {
          console.log(err.response)
        })
    },
    add () {
      this.$router.push('/add_member')
    },
    edit () {
      this.$router.push({ path: '/edit_member', query: this.selected })
    },
    deleteRow () {
      this.$axios
        .get('/db/delete_reviewer', {
          params: { github_id: this.selected.github_id }
        })
        .then((result) => {
          if (result.status === 200) {
            alert('已删除！')
            this.init()
          } else {
            alert('删除失败！')
          }
        })
    }
  }
}
</script>
