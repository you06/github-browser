<template>
  <section class="section">
    <button
      :disabled="!selected"
      @click="selected = null"
      class="button field is-primary"
    >
      <span>Clear selected</span>
    </button>
    <button
      @click="add"
      class="button field is-success"
      to="./add_member"
    >
      <span>Add</span>
    </button>
    <button
      :disabled="!selected"
      @click="edit"
      class="button field is-info"
    >
      <span>edit</span>
    </button>
    <button
      :disabled="!selected"
      @click="deleteRow"
      class="button field is-danger"
    >
      <span>delete</span>
    </button>

    <b-tabs>
      <b-tab-item label="Table">
        <b-table
          :data="data"
          :selected.sync="selected"
          :paginated="true"
          :per-page="5"
          :current-page="1"
          :pagination-simple="false"
          focusable
        >
          <template slot-scope="props">
            <b-table-column field="github_id" label="Github Id">
              <a @click="prInfo(props.row)">
                {{ props.row.github_id }}
              </a>
            </b-table-column>
            <b-table-column field="organization" label="Organization">
              {{ props.row.organization }}
            </b-table-column>
            <b-table-column field="email" label="Email">
              {{ props.row.email }}
            </b-table-column>
            <b-table-column field="slack_id" label="pr_cnt">
              {{ props.row.slack_id }}
            </b-table-column>
            <b-table-column field="group_name" label="repo">
              {{ props.row.group_name }}
            </b-table-column>
            <b-table-column field="role" label="Role">
              {{ props.row.role }}
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
import { formatDatetime } from '@/utils/datetime'
export default {
  data () {
    return {
      data: [],
      selected: this.data
      // time: {
      //   start: getLastDayinWeek(4),
      //   end: new Date()
      // }
      // columns: [
      //   {
      //     field: 'github_id',
      //     label: 'Github Id',
      //     searchable: true
      //   },
      //   {
      //     field: 'organization',
      //     label: 'Organization',
      //     searchable: true
      //   },
      //   {
      //     field: 'email',
      //     label: 'Email',
      //     searchable: true
      //   },
      //   {
      //     field: 'slack_id',
      //     label: 'pr_num',
      //     searchable: true
      //   },
      //   {
      //     field: 'group_name',
      //     label: 'Group Name',
      //     searchable: true
      //   },
      //   {
      //     field: 'role',
      //     label: 'Role',
      //     searchable: true
      //   }
      // ]
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
    prInfo (row) {
      this.$router.push({ path: '/prInfo',
        query: {
          user: row.github_id,
          start: new Date(new Date().getTime() - (new Date().getDay() + 365) * 24 * 3600 * 1000),
          end: formatDatetime(new Date())
        } })
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
