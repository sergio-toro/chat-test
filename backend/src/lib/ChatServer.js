const socketIo = require('socket.io')
const { find, uniqueId, findLast } = require('lodash')

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
      socket.on('update', this.handleUpdateMessage.bind(this, socket))
      socket.on('countdown', this.handleCountdown.bind(this, socket))
      socket.on('typing', this.handleIsTyping.bind(this, socket))
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

  handleRemoveMessage (client, deletedMessage, ackFn) {
    this.log('User removes message', client.id, deletedMessage.id)

    const message = find(this.messages, { id: deletedMessage.id })
    if (message.userId !== client.id) {
      return
    }

    this.messages = this.messages.filter(({ id }) => id !== message.id)
    ackFn(message)

    client.broadcast.emit('remove', message)
  }

  handleUpdateMessage (client, updatedMessage, ackFn) {
    this.log('User updates message', client.id, updatedMessage.id)

    const message = find(this.messages, { id: updatedMessage.id })
    if (message.userId !== client.id) {
      return
    }

    this.messages = this.messages.map(
      (msg) => (msg.id === message.id) ? updatedMessage : msg
    )
    ackFn(updatedMessage)

    client.broadcast.emit('update', updatedMessage)
  }

  handleCountdown (client, data) {
    this.log('User scheduled countdown', client.id, data)

    client.broadcast.emit('countdown', data)
  }

  handleIsTyping (client, isTyping) {
    this.log('User is typing', client.id, isTyping)

    client.broadcast.emit('typing', isTyping)
  }

  log (...args) {
    console.log(`===> ChatServer:`, ...args)
  }
}
