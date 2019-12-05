const { json } = require('../utils')

module.exports = function(cfg, pkg) {

  return {
    async getViews(ctx, next) {
      ctx.body = json(await pkg.db.getViewTables())
    },

    async getView(ctx, next) {
      const {
        view
      } = ctx.request.query

      ctx.body = json({
        columns: await pkg.db.getColumns(view),
        data: await pkg.db.queryView(view)
      })
    },

    async getReview(ctx, next) {
      const {
        github,
        start,
        end
      } = ctx.request.query

      data = await pkg.db.getReviewPulls({github, start, end})

      ctx.body = json(data.pulls)
    }
  }
}
