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