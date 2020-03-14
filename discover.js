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

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Promise not resolved after 10000 ms`))
      }, 10000)

      client
        .connection
        .send(delta)
        .then(result => {
          if (timeout) {
            clearTimeout(timeout)
          }

          debug(`Sent delta; result: ${result}`)
          resolve(delta)
        })
        .catch(err => {
          if (timeout) {
            clearTimeout(timeout)
          }

          debug(`Error sending delta: ${err.message}`)
          reject(err)
        })
    })
  }
}

module.exports = function discover () {
  const username = 'xmiles@decipher.industries'
  const password = 'xmiles2020'

  client = new Client({
    hostname: 'signalk.decipher.digital',
    port: 443,
    useTLS: true,
    reconnect: true,
    autoConnect: false,
    notifications: false,
    useAuthentication: false,
    bearerTokenPrefix: 'JWT'
  })

  client.on('connect', () => {
    debug(`Connected to Signal K server, authenticating`)
    client.authenticate(username, password)
  })

  client.once('authenticated', data => {
    debug(`Authenticated with Signal K server: ${JSON.stringify(data, null, 2)}`)
    ready = true
  })

  client.connect()
  return server
}
