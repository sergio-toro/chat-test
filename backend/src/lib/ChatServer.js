const socketIo = require('socket.io')

module.exports = class ChatServer {

  constructor(socketPort) {
    this.io = socketIo(socketPort)
    this.clients = []
    this.messages = []

    this.io.on('connection', (socket) => {
      this.onClientConnected(socket)

      socket.on('disconnect', this.onClientDisconnected.bind(this, socket))
    })
  }

  onClientConnected (client) {
    this.log('User connected', client.id)

    if (this.clients.length >= 2) {
      client.emit('max_connections')
      return client.disconnect(true)
    }

    this.clients.push({ id: client.id, nickname: null })

    this.io.sockets.emit('clients', this.clients)
    client.emit('messages', this.messages)
  }

  onClientDisconnected (client) {
    this.log('User disconnected', client.id)

    this.clients = this.clients.filter(({ id }) => id !== client.id)
    this.io.sockets.emit('clients', this.clients)
  }

  log (...args) {
    console.log(`===> ChatServer:`, ...args)
  }
}
