const socketIo = require('socket.io')
const { uniqueId, findLast } = require('lodash')

module.exports = class ChatServer {

  constructor(socketPort) {
    this.io = socketIo(socketPort)
    this.clients = []
    this.messages = []

    this.io.on('connection', (socket) => {
      this.onClientConnected(socket)

      socket.on('disconnect', this.handleClientDisconnected.bind(this, socket))

      socket.on('nickname', this.handleSetNickname.bind(this, socket))
      socket.on('message', this.handleNewMessage.bind(this, socket))
      socket.on('remove', this.handleRemoveMessage.bind(this, socket))
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
    this.messages = this.messages.filter(({ userId }) => userId !== client.id)

    this.io.sockets.emit('clients', this.clients)
    this.io.sockets.emit('messages', this.messages)
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

  handleNewMessage (client, { message, modifiers }, ackFn) {
    this.log('User sent message', client.id, message, modifiers)

    const newMessage = {
      id: uniqueId(`msg-${client.id}-`),
      message,
      modifiers,
      userId: client.id,
    }

    this.messages = this.messages.concat([ newMessage ])
    ackFn(newMessage)

    client.broadcast.emit('message', newMessage)
  }

  handleRemoveMessage (client, message, ackFn) {
    this.log('User removes message', client.id, message.id, message.userId, message.userId !== client.id)

    if (message.userId !== client.id) {
      return
    }

    this.messages = this.messages.filter(({ id }) => id !== message.id)
    ackFn(message)

    client.broadcast.emit('remove', message)
  }

  log (...args) {
    console.log(`===> ChatServer:`, ...args)
  }
}
