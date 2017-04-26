import React, { Component } from 'react'
import io from 'socket.io-client'
import { find, get, findLast } from 'lodash'

import ChatInterface from './components/ChatInterface'

import './App.css'

export default class App extends Component {
  constructor (props) {
    super(props)

    this.socket = null
    this.state = {
      messages: [],
      clients: [],
    }
  }

  componentDidMount () {
    this.socket = io(process.env.REACT_APP_CHAT_URL)

    this.socket.on('connect', (arg) => {
      console.log('--> Socket.io connected', this.socket.id)
    })
    this.socket.on('disconnect', this.onDisconnect)
    this.socket.on('clients', this.onInitClients)
    this.socket.on('messages', this.onInitMessages)
    this.socket.on('message', this.onNewMessage)
    this.socket.on('remove', this.onRemoveMessage)

    this.socket.on('max_connections', () => {
      console.warn('--> Socket.io cannot connect due to full chat room')
      window.alert('Sorry the chat room is full, try again later.')
      this.socket = null
    })
  }

  onDisconnect = () => {
    console.log('--> Socket.io disconnect')
    this.setState({ messages: [], clients: [] })
  }

  onInitClients = (clients) => {
    console.log('--> Socket.io clients', clients)
    this.setState({ clients })
  }

  onInitMessages = (messages) => {
    console.log('--> Socket.io messages', messages)
    this.setState({ messages })
  }

  onRemoveMessage = (message) => {
    console.log('--> Socket.io remove message', message)
    const { messages } = this.state
    this.setState({
      messages: messages.filter(({ id }) => id !== message.id),
    })
  }

  onNewMessage = (message) => {
    console.log('--> Socket.io message received', message)
    const { messages } = this.state
    this.setState({
      messages: messages.concat([ message ]),
    })
  }

  handleSendMessage = (message) => {
    console.log('--> Socket.io send message', message)
    this.socket.emit('message', message, this.onNewMessage)
  }

  handleSetNick = (nickname) => {
    console.log('--> Socket.io set nickname', nickname)
    this.socket.emit('nickname', nickname)
  }

  handleRemoveLast = (data) => {
    const { messages } = this.state
    const message = findLast(messages, { userId: this.socket.id })
    if (message) {
      console.log('--> Socket.io remove last message', message)
      this.socket.emit('remove', message, this.onRemoveMessage)
    }
  }

  render() {
    const { messages, clients } = this.state

    const user = find(clients, { id: get(this.socket, 'id') })
    const [ chattingWith ] = clients.filter(client => client.id !== get(user, 'id'))

    if (!user || !chattingWith) {
      return (<div>Waiting users to join the chat....</div>)
    }

    return (
      <ChatInterface
        chattingWith={chattingWith}
        user={user}
        messages={messages}

        onSendMessage={this.handleSendMessage}
        onSetNick={this.handleSetNick}
        onRemoveLast={this.handleRemoveLast}
      />
    )
  }
}
