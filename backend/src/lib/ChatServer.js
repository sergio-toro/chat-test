const socketIo = require('socket.io')

module.exports = class ChatServer {
  constructor(socketPort) {
    this.io = socketIo(socketPort)

    this.io.on('connection', (socket) => {
      this.onClientConnected(socket)

      socket.on('disconnect', this.onClientDisconnected.bind(this))
    })
  }

  onClientConnected(socket) {
    this.log('User connected', socket.id)
  }

  onClientDisconnected(socket) {
    this.log('User disconnected', socket.id)
  }

  log (message, ...args) {
    console.log(`===> ChatServer:`, ...args)
  }
}
