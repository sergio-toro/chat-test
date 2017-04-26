import React, { Component } from 'react'
import io from 'socket.io-client'
// import { find, get } from 'lodash'

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
    })

    this.socket.on('clients', (data) => {
      console.log('--> Socket.io clients:', data)
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
    const { messages } = this.state
    return (
      <ChatInterface
        chattingWith={{ id: 2, nickname: 'Hola mundo!' }}
        user={{ id: 1, nickname: null }}
        messages={messages}

        onSendMessage={this.handleSendMessage}
        onSendThinkMessage={this.handleSendThinkMessage}
        onSetNick={this.handleSetNick}
        onRemoveLast={this.handleRemoveLast}
      />
    )
  }
}
