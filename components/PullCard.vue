<template>
  <div class="pullcard-container">
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
</template>

<script>
import { formatDate } from '@/utils/datetime'

export default {
  name: 'PullCard',
  props: {
    pull: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    formatDate
  }
}
</script>script>

<style lang="stylus" scoped>
.pullcard-container
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
