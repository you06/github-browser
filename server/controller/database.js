const { json } = require('../utils')

module.exports = function (cfg, pkg) {
  return {
    async getViews (ctx, next) {
      ctx.body = json(await pkg.db.getViewTables())
    },

    async getView (ctx, next) {
      const {
        view
      } = ctx.request.query

      ctx.body = json({
        columns: await pkg.db.getColumns(view),
        data: await pkg.db.queryView(view)
      })
    },

    async getMembers(ctx, next) {
      ctx.body = json(await pkg.db.queryMembers())
    },

    async getReview (ctx, next) {
      const {
        github,
        start,
        end
      } = ctx.request.query
      const data = await pkg.db.getReviewPulls({ github, start, end })
      ctx.body = json(data.pulls)
    },

    async getReviewers (ctx) {
      const {
        start,
        end
      } = ctx.request.query
      const reviews = await pkg.db.queryReviewers({ start, end })
      const members = await pkg.db.queryMembers()
      const users = reviews.map(i => i.user)
      for (const m of members) {
        if (users.indexOf(m.github_id) < 0) {
          reviews.push({
            user: m.github_id,
            number: 0
          })
        }
      }
      ctx.body = json(reviews)
    },

    async getReviewerByUser (ctx) {
      const {
        user,
        start,
        end
      } = ctx.request.query
      ctx.body = json(await pkg.db.getReviewerByUser(user, start, end))
    },

    async deleteReviewerById (ctx) {
      const {
        github_id
      } = ctx.request.query
      ctx.body = json(await pkg.db.deleteReviewerById(github_id))
    },

    async editReviewer (ctx) {
      const {
        github_id,
        email,
        organization,
        slack_id,
        group_name,
        role,
        id
      } = ctx.request.query
      ctx.body = json(await pkg.db.updateReviewerById({ github_id, email, organization, slack_id, group_name, role, id }))
    },

    async addReviewer (ctx) {
      const {
        github_id,
        email,
        organization,
        slack_id,
        group_name,
        role
      } = ctx.request.query
      ctx.body = json(await pkg.db.insertReviewer({ github_id, email, organization, slack_id, group_name, role }))
    }
  }
}
