const Router = require('koa-router')
const Controller = require('./controller/')

function initRoute(cfg, pkg) {
  const ctl = Controller(cfg, pkg)

  const router = new Router({
    prefix: '/api'
  })

  router.get('/ping', (ctx, next) => {
    ctx.body = 'pong!'
  })

  // pull queries
  router.get('/pulls/query', ctl.pull.getPulls)
  router.get('/pulls/subtask', ctl.pull.subtask)

  // pull queries
  router.get('/db/views', ctl.db.getViews)
  router.get('/db/view', ctl.db.getView)
  router.get('/db/review', ctl.db.getReview)
  router.get('/db/reviewers', ctl.db.getReviewers)
  router.get('/db/reviewer', ctl.db.getReviewerById)
  router.get('/db/delete_reviewer', ctl.db.deleteReviewerById)
  router.get('/db/add_reviewer', ctl.db.addReviewer)
  router.get('/db/update_reviewer', ctl.db.editReviewer)
  router.get('/db/members', ctl.db.getMembers)

  return router
}

module.exports = initRoute
