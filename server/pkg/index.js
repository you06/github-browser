const Github = require('./github')

module.exports = (cfg) => {
  return {
    github: Github(cfg)
  }
}
