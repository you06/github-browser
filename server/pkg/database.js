const mysql = require('mysql')

const SCHEMA_SQL = `SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE FROM information_schema.tables`

module.exports = class {
  constructor (cfg) {
    this.cfg = cfg
    this.database = this.cfg.database
    this.driver = mysql.createConnection(this.database)
    this.driver.connect()
  }

  async query (sql, args) {
    return new Promise((resolve, reject) => {
      function cb (error, results, fields) {
        if (error) {
          console.log(error)
          reject(error)
        }
        resolve(results)
      }
      if (args) {
        this.driver.query(sql, args, cb)
      } else {
        this.driver.query(sql, cb)
      }
    })
  }

  async getViewTables () {
    const tables = await this.query(SCHEMA_SQL)
    const views = []
    for (const table of tables) {
      if (table.TABLE_TYPE === 'VIEW' && table.TABLE_SCHEMA === this.database.database) {
        views.push(table.TABLE_NAME)
      }
    }
    return views
  }

  async getColumns (view) {
    const schema = await this.query(`DESC ${view}`)
    const cols = []
    for (const c of schema) {
      cols.push(c.Field)
    }
    return cols
  }

  async queryView (view) {
    return await this.query(`SELECT * FROM ${view}`)
  }

  async getReviewPulls ({ github, start, end }) {
    const comments = (await this.query(`SELECT * FROM comments WHERE user = ? AND created_at BETWEEN ? AND ?`, [
      github,
      start,
      end
    ])).filter((item) => {
      return !item.body.startsWith('/')
    })

    const pullsNumbers = comments.reduce((arr, comment) => {
      let skip = false
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].owner === comment.owner &&
          arr[i].repo === comment.repo &&
          arr[i].number === comment.pull_number) {
          skip = true
        }
      }
      if (!skip) {
        arr.push({
          owner: comment.owner,
          repo: comment.repo,
          number: comment.pull_number
        })
      }
      return arr
    }, [])

    if (pullsNumbers.length === 0) {
      return {
        pulls: [],
        comments: []
      }
    }

    const pulls = (await this.query(`SELECT * FROM pulls WHERE pull_number IN (${pullsNumbers.map(item => item.number).join(',')})`))
      .filter((item) => {
        if (item.user === github) {
          return false
        }
        for (let i = 0; i < pullsNumbers.length; i++) {
          if (pullsNumbers[i].owner === item.owner &&
            pullsNumbers[i].repo === item.repo &&
            pullsNumbers[i].number === item.pull_number) {
            return true
          }
        }
        return false
      })
    return {
      pulls,
      comments
    }
  }

  async queryMembers() {
    return await this.query(`SELECT * FROM reviewers`)
  }

  async queryReviewers ({ start, end }) {
    const reviewers = await this.query(`SELECT
                                          c.user AS user,
                                          count( DISTINCT c.pull_number ) AS number
                                        FROM
                                          pulls AS p,
                                          comments AS c 
                                        WHERE
                                          c.user IN (SELECT github_id FROM reviewers) 
                                          AND p.pull_number = c.pull_number 
                                          AND p.owner = c.owner 
                                          AND p.repo = c.repo
                                          AND p.user != c.user
                                          AND c.created_at BETWEEN ? 
                                          AND ?
                                        GROUP BY
                                        USER 
                                        ORDER BY
                                          number DESC`,
    [
      start,
      end
    ])
    return reviewers
  }

  async getReviewerById (user, start, end) {
    const pullInfo = (await this.query(`SELECT DISTINCT
                                          p.pull_number AS pull_id,
                                          p.user AS user,
                                          p.repo AS repo,
                                          title,
                                          p.created_at AS created_at,
                                          p.merged_at AS merged_at 
                                        FROM
                                          pulls AS p,
                                          comments AS c 
                                        WHERE
                                          c.USER = ? 
                                          AND p.pull_number = c.pull_number 
                                          AND p.repo = c.repo 
                                          AND p.owner = c.owner 
                                          AND p.user != c.user
                                          AND p.created_at BETWEEN ? 
                                          AND ?`,
    [user, start, end]))
      .filter((item) => {
        if (item.user === user) {
          return false
        }
        return true
      })
    return pullInfo
  }
  async deleteReviewerById (github_id) {
    const status = await this.query('delete from reviewers WHERE github_id = ?', github_id)
    return status
  }
  async updateReviewerById ({ github_id, email, organization, slack_id, group_name, role, id }) {
    const status = await this.query('UPDATE reviewers SET github_id=?,email=?,organization=?,slack_id=?,group_name=?,role=? WHERE github_id = ?', [github_id, email, organization, slack_id, group_name, role, id])
    return status
  }
  async insertReviewer ({ github_id, email, organization, slack_id, group_name, role }) {
    const id = await this.query('INSERT INTO reviewers (github_id, email, organization, slack_id, group_name, role) VALUES (?,?,?,?,?,?)', [github_id, email, organization, slack_id, group_name, role])
    return id
  }
}
