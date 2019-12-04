const mysql = require('mysql')

const SCHEMA_SQL = `SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE FROM information_schema.tables`

module.exports = class {
  constructor(cfg) {
    this.cfg = cfg
    this.database = this.cfg.database
    this.driver = mysql.createConnection(this.database)
    this.driver.connect()
  }
  
  async query(sql) {
    return new Promise((resolve, reject) => {
      this.driver.query(sql, (error, results, fields) => {
        if (error) reject(error)
        resolve(results)
      })
    })
  }

  async getViewTables() {
    const tables = await this.query(SCHEMA_SQL)
    const views = []
    for (const table of tables) {
      if (table.TABLE_TYPE === 'VIEW' && table.TABLE_SCHEMA === this.database.database) {
        views.push(table.TABLE_NAME)
      }
    }
    return views
  }

  async getColumns(view) {
    const schema = await this.query(`DESC ${view}`)
    const cols = []
    for (const c of schema) {
      cols.push(c.Field)
    }
    return cols
  }

  async queryView(view) {
    return await this.query(`SELECT * FROM ${view}`)
  }
}
