const discover = require('./discover')
const server = discover()

async function handleDeltaMessage (delta) {
  try {
    const items = await server.send(delta)

    if (items && Array.isArray(items)) {
      debug(`PUT ${items.length} paths`)
    }
  } catch (err) {
    console.error(`[exception] ${err.message}`)
    process.exit(1)
  }
}

function sendSomeDelta () {
  const delta = {
    context: 'self',
    updates: [
      {
        source: { label: 'Test script' },
        timestamp: new Date().toISOString(),
        values: [
          { path: 'electrical.batteries.99.capacity.stateOfCharge', value: Math.random() },
          { path: 'electrical.batteries.99.name', value: 'ULTRASONIC' },
          { path: 'electrical.batteries.99.location', value: 'Mast' }
        ]
      }
    ]
  }

  handleDeltaMessage(delta)
}

setInterval(() => sendSomeDelta(), 1000)
