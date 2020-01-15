<template>
  <section class="section">
    <b-field label="github_id">
      <b-input v-model="github_id" :value="github_id" />
    </b-field>

    <b-field
      label="email"
    >
      <b-input
        v-model="email"
        :value="email"
        type="email"
      />
    </b-field>

    <b-field
      label="organization"
    >
      <b-input v-model="organization" :value="organization" />
    </b-field>

    <b-field
      label="slack_id"
    >
      <b-input v-model="slack_id" :value="slack_id" />
    </b-field>

    <b-field
      label="group_name"
    >
      <b-input v-model="group_name" :value="group_name" />
    </b-field>

    <b-field
      label="role"
    >
      <b-input v-model="role" :value="role" />
    </b-field>

    <button
      class="button is-primary"
      @click="edit"
    >
      <span>commit</span>
    </button>
  </section>
</template>

<script>
export default {
  data () {
    return {
      github_id: this.$route.query.github_id,
      organization: this.$route.query.organization,
      email: this.$route.query.email,
      slack_id: this.$route.query.slack_id,
      group_name: this.$route.query.group_name,
      role: this.$route.query.role,
      id: this.$route.query.github_id
    }
  },
  methods: {
    edit () {
      const editData = {
        github_id: this.github_id,
        organization: this.organization,
        email: this.email,
        slack_id: this.slack_id,
        group_name: this.group_name,
        role: this.role,
        id: this.id
      }
      this.$axios
        .get('/db/update_reviewer', {
          params: editData
        })
        .then((result) => {
          if (result.status === 200) {
            alert('更新成功！')
            this.$router.push('/member')
          } else {
            alert('更新失败！')
          }
        })
    }
  }
}
</script>
