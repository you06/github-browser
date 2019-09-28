const Pull = require('./pull')

module.exports = (cfg, pkg) => {
  return {
    pull: Pull(cfg, pkg)
  }
}
