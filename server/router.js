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

  return router
}

module.exports = initRoute
