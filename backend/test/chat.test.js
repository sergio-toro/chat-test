const { expect } = require('chai')
const { getSocketClient } = require('./testUtils')

describe('Chat tests', () => {

  it(`should connect 2 clients correctly`, function(done) {
    const socket1 = getSocketClient()
    const socket2 = getSocketClient()

    let successfulConnections = 0
    const onConnect = () => {
      successfulConnections++

      if (successfulConnections === 2) {
        done()
      }
    }

    socket1.on('connect', onConnect)
    socket2.on('connect', onConnect)
  })

})
