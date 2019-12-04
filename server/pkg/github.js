const Octokit = require('@octokit/rest')

module.exports = class {
  constructor(cfg) {
    this.cfg = cfg
    this.octokit = new Octokit({
      auth: cfg.github
    })
    this.perPage = 100
    this.commonRateLimit = 5000
  }

  async retry(fn, ...args) {
    for (let i = 0; i < MaxReretTime; i++) {
      try {
        const res = await fn.call(this, ...args)
        return res
      } catch(e) {
        console.log(e)
      }
    }
    console.log(`retry over ${MaxReretTime} times, exit`)
    process.exit(1)
  }

  async pull(owner, repo, pull_number) {
    return new Promise((resolve, reject) => {
      this.octokit.pulls.get({
        owner,
        repo,
        pull_number
      }).then(res => {
        const { headers } = res
        const limit = parseInt(headers['x-ratelimit-remaining'])
        this.commonRateLimit = limit
        resolve(res.data)
      }).catch(reason => {
        reject(reason)
      })
    })
  }

  async pullsList(owner, repo, page, state, sort = 'created', head = '') {
    return new Promise((resolve, reject) => {
      this.octokit.pulls.list({
        owner,
        repo,
        state,
        direction: 'desc',
        sort,
        per_page: this.perPage,
        page,
        head
      }).then(res => {
        const { headers } = res
        const limit = parseInt(headers['x-ratelimit-remaining'])
        this.commonRateLimit = limit
        resolve(res.data)
      }).catch(reason => {
        reject(reason)
      })
    })
  }
    
  async pullsListRange(owner, repo, state, start, end, head = '') {
    const res = []
    let finish = false
    let sort = 'created'
    let s = 'all'
    if (state === 'merged') {
      s = 'closed'
      sort = 'updated'
    } else if (state === 'all') {
      sort = 'updated'
    }

    for (let page = 1; !finish; page++) {
      const pulls = await this.pullsList(owner, repo, page, s, sort, head)
      console.log(state, page, pulls.length)
      for (const pull of pulls) {
        // if finish
        if (new Date(pull.updated_at).getTime() < start) {
          finish = true
        }
        res.push(pull)
      }
    }

    return res.filter((pull) => {
      if (state === 'merged') {
        return pull.merged_at !== null
      }
      return true
    }).filter((pull) => {
      const t = state === 'merged' ?
        new Date(pull.merged_at).getTime() :
        new Date(pull.created_at).getTime()
      return t < end && t > start
    })
  }
}
