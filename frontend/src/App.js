import React, { Component } from 'react'
import io from 'socket.io-client'
import { find, get } from 'lodash'

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
    this.socket.on('disconnect', (arg) => {
      console.log('--> Socket.io disconnect', arg)
      this.setState({ messages: [], clients: [] })
    })

    this.socket.on('clients', (data) => {
      console.log('--> Socket.io clients:', data)
      this.setState({ clients: data })
    })
    this.socket.on('messages', this.onInitMessages)

    this.socket.on('message', this.onNewMessage)

    this.socket.on('max_connections', () => {
      console.warn('--> Socket.io cannot connect due to full chat room')
      window.alert('Sorry the chat room is full, try again later.')
      this.socket = null
    })
  }

  onInitMessages = (messages) => {
    console.log('--> Socket.io messages', messages)
    this.setState({ messages })
  }

  onNewMessage = (message) => {
    console.log('--> Socket.io message received', message)
    const { messages } = this.state
    this.setState({
      messages: messages.concat([ message ]),
    })
  }

  handleEmitMessage = (msgObject) => {
    console.log('--> Socket.io send message', msgObject)
    this.socket.emit('message', msgObject, this.onNewMessage)
  }

  handleSendMessage = (message) => {
    this.handleEmitMessage({
      message,
      modifiers: [],
    })
  }

  handleSendThinkMessage = (message) => {
    this.handleEmitMessage({
      message,
      modifiers: ['think'],
    })
  }

  handleSetNick = (nickname) => {
    console.log('--> Socket.io set nickname', nickname)
    this.socket.emit('nickname', nickname)
  }

  handleRemoveLast = (data) => {
    console.log('remove last', data)
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
        onSendThinkMessage={this.handleSendThinkMessage}
        onSetNick={this.handleSetNick}
        onRemoveLast={this.handleRemoveLast}
      />
    )
  }
}
