const Octokit = require('@octokit/rest')

module.exports = (cfg) => {
  const octokit = new Octokit({
    auth: cfg.github
  })
  const data = {
    perPage: 200,
    commonRateLimit: 5000,
  }

  async function pullsList(owner, repo, page, state, sort = 'created', head = '') {
    return new Promise((resolve, reject) => {
      octokit.pulls.list({
        owner,
        repo,
        state,
        direction: 'desc',
        sort,
        per_page: data.perPage,
        page,
        head
      }).then(res => {
        const { headers } = res
        const limit = parseInt(headers['x-ratelimit-remaining'])
        data.commonRateLimit = limit
        resolve(res.data)
      }).catch(reason => {
        reject(reason)
      })
    })
  }

  const r = {
    // properties
    data,
    // functions
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
    },
    pullsList,
    async pullsListRange(owner, repo, state, start, end, head = '') {
      const res = []
      let finish = false
      let sort = 'created'
      let s = 'all'
      if (state === 'merged') {
        s = 'closed'
        sort = 'updated'
      }

      for (let page = 1; !finish; page++) {
        const pulls = await pullsList(owner, repo, page, s, sort, head)
        for (const pull of pulls) {
          // if finish
          if (state === 'merged') {
            if (new Date(pull.updated_at).getTime() < end) {
              finish = true
            }
          } else if (state === 'created') {
            if (new Date(pull.created_at).getTime() < end) {
              finish = true
            }
          } else {
            if (new Date(pull.updated_at).getTime() < end) {
              finish = true
            }
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

  return r
}
