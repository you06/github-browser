<template>
  <section>
    <b-field label="github_id">
      <b-input v-model="github_id" value="" />
    </b-field>

    <b-field
      label="email"
    >
      <b-input
        v-model="email"
        type="email"
        value=""
      />
    </b-field>

    <b-field
      label="organization"
    >
      <b-input v-model="organization" value="" />
    </b-field>

    <b-field
      label="slack_id"
    >
      <b-input v-model="slack_id" value="" />
    </b-field>

    <b-field
      label="group_name"
    >
      <b-input v-model="group_name" value="" />
    </b-field>

    <b-field
      label="role"
    >
      <b-input v-model="role" value="" />
    </b-field>

    <button
      @click="add"
      class="button is-primary"
    >
      <span>commit</span>
    </button>
  </section>
</template>

<script>
export default {
  data () {
    return {
      github_id: '',
      organization: '',
      email: '',
      slack_id: '',
      group_name: '',
      role: ''
    }
  },
  methods: {
    add () {
      const addData = {
        github_id: this.github_id,
        organization: this.organization,
        email: this.email,
        slack_id: this.slack_id,
        group_name: this.group_name,
        role: this.role
      }
      this.$axios({
        method: 'get',
        url: '/db/add_reviewer',
        params: addData
      }).then((result) => {
        const res = result.data.data
        if (res.insertId !== 0) {
          alert('添加成功！')
          this.$router.push('/member')
        } else {
          alert('添加失败！')
        }
      })
    }
  }
}
</script>
