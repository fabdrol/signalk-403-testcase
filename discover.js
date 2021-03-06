const debug = require('debug')('signalk-403-test/discover')
const Client = require('@signalk/client').default

let client = null
let ready = false

const server = {
  client,
  ready,
  send (delta) {
    if (!client || ready === false) {
      return
    }

    if (!delta || typeof delta !== 'object' || !Array.isArray(delta.updates)) {
      return debug('Delta is malformed')
    }

    const promises = []
    
    delta.updates.forEach(update => {
      if (!update || typeof update !== 'object' || !Array.isArray(update.values)) {
        return
      }

      update.values.forEach(mutation => {
        promises.push(this.putDelta(mutation.path, mutation.value))
      })
    })

    if (Array.isArray(promises) && promises.length > 0) {
      debug(`PUTting ${promises.length} values`)
      return Promise.all(promises)
    }

    debug(`No deltas to PUT`)
    return Promise.resolve([])
  },

  putDelta (path, value) {
    return new Promise((resolve, reject) => {
      debug(`[pending] PUT ${path} => ${value}`)
      
      const request = client.request('PUT', {
        put: {
          path,
          value
        }
      })

      request.once('response', response => {
        if (response.statusCode !== 200) {
          debug(`[failed] PUT ${response.statusCode} ${response.statusText || response.data || ''}`)
          return reject(new Error(`PUT ${response.statusCode} ${response.statusText}`))
        }
        resolve(response)
      })

      request.once('error', err => {
        debug(`[failed] PUT ${err.message}`)
        reject(err)
      })

      request.send()
    })
  }
}

module.exports = function discover () {
  client = new Client({
    hostname: 'signalk.decipher.digital',
    port: 443,
    useTLS: true,
    reconnect: true,
    autoConnect: false,
    notifications: false,
    useAuthentication: true,
    bearerTokenPrefix: 'JWT',
    username: 'xmiles@decipher.industries',
    password: 'xmiles2020'
  })

  client.on('connect', () => {
    debug(`Connected to Signal K server`)
    ready = true
  })

  client.connect()
  return server
}