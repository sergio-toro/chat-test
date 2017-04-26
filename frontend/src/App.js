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
    this.socket.on('messages', (data) => {
      console.log('--> Socket.io messages:', data)
    })

    this.socket.on('max_connections', () => {
      console.warn('--> Socket.io cannot connect due to full chat room')
      window.alert('Sorry the chat room is full, try again later.')
      this.socket = null
    })
  }

  handleSendMessage = (message) => {
    console.log('send message', message)
  }

  handleSendThinkMessage = (data) => {
    console.log('send think message', data)
  }

  handleSetNick = (data) => {
    console.log('set nickname', data)
  }

  handleSetNick = (data) => {
    console.log('set nickname', data)
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
