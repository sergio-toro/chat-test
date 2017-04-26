const socketIo = require('socket.io')

module.exports = class ChatServer {

  constructor(socketPort) {
    this.io = socketIo(socketPort)
    this.clients = []
    this.messages = []

    this.io.on('connection', (socket) => {
      this.onClientConnected(socket)

      socket.on('disconnect', this.handleClientDisconnected.bind(this, socket))

      socket.on('nickname', this.handleSetNickname.bind(this, socket))
      socket.on('message', this.handleMessage.bind(this, socket))
    })
  }

  onClientConnected (client) {
    if (this.clients.length >= 2) {
      this.log('User hit max_connections', client.id, this.clients)
      client.emit('max_connections')
      return client.disconnect(true)
    }

    this.clients.push({ id: client.id, nickname: null })

    this.io.sockets.emit('clients', this.clients)
    client.emit('messages', this.messages)

    this.log('User connected', client.id, this.clients)
  }

  handleClientDisconnected (client) {
    this.log('User disconnected', client.id)

    this.clients = this.clients.filter(({ id }) => id !== client.id)
    this.io.sockets.emit('clients', this.clients)
  }

  handleSetNickname (client, nickname) {
    this.log('User set nickname', client.id, nickname)

    this.clients = this.clients.map((user) => {
      if (user.id === client.id) {
        user.nickname = nickname
      }
      return user
    })

    this.io.sockets.emit('clients', this.clients)
  }

  handleMessage (client, { message, modifiers }, ackFn) {
    this.log('User sent message', client.id, message, modifiers)

    const newMessage = {
      message,
      modifiers,
      userId: client.id,
    }

    this.messages = this.messages.concat([ newMessage ])
    ackFn(newMessage)

    client.broadcast.emit('message', newMessage)
  }

  log (...args) {
    console.log(`===> ChatServer:`, ...args)
  }
}
