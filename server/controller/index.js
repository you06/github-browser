const Pull = require('./pull')
const DB = require('./database')

module.exports = (cfg, pkg) => {
  return {
    pull: Pull(cfg, pkg),
    db: DB(cfg, pkg)
  }
}
