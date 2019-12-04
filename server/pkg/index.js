const Github = require('./github')
const DB = require('./database')

module.exports = (cfg) => {
  return {
    github: new Github(cfg),
    db: new DB(cfg)
  }
}
