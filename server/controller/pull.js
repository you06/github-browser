const { json } = require('../utils/')

module.exports = function(cfg, pkg) {

  return {
    async getPulls(ctx, next) {
      const {
        owner,
        repo,
        keyword,
        state,
        start,
        end
      } = ctx.request.query

      if (!owner || !repo) {
        ctx.body = json(false, false, 'no owner or repo')
        return
      }
      const keywords = keyword.trim().split(' ').map(i => i.toLowerCase())

      const pulls = await pkg.github.pullsListRange(owner, repo, state, start, end)

      ctx.body = json(pulls
        .filter((item) => {
          const title = item.title.toLowerCase()
          for (const k of keywords) {
            if (title.indexOf(k) < 0) {
              return false
            }
          }
          return true
        })
        .map((item) => {
          return {
            number: item.number,
            state: item.state,
            title: item.title,
            user: {
              login: item.user.login
            },
            created_at: item.created_at,
            merged_at: item.merged_at,
            updated_at: item.updated_at,
            closed_at: item.closed_at,
            html_url: `https://github.com/${owner}/${repo}/pull/${item.number}`
          }
        })
      )
    }
  }
}
