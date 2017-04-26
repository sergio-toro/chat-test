import React, { Component } from 'react'
import io from 'socket.io-client'
import { find, get, findLast } from 'lodash'
import styled from 'styled-components'

import ChatInterface from './components/ChatInterface'
import clock from './assets/clock.png'

import './App.css'

const AppContainer = styled.div`
  height: 100%;
  position: relative;
`

const CountdownImage = styled.div`
  position: absolute;
  left: 50px;
  top: calc(50% - 100px);
  background: #ECE5DD;
  padding: 25px;
  box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 0.2);
  border: 2px solid #075E54;
  border-radius: 15px;

  img {
    width: 100px;
  }

  span, strong {
    font-size: 22px;
  }

  strong {
    font-weight: bold;
  }
`

export default class App extends Component {
  constructor (props) {
    super(props)

    this.socket = null
    this.state = {
      messages: [],
      clients: [],
      countdown: null,
      isTyping: false,
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
    this.socket.on('countdown', this.onCountdown)
    this.socket.on('typing', this.onIsTyping)

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

  onCountdown = (data) => {
    console.log('--> Socket.io countdown', data)
    this.setState({ countdown: data })

    const intervalId = setInterval(() => {
      const { countdown } = this.state
      const newTimeout = countdown.timeout - 1

      if (newTimeout === 0) {
        window.location = countdown.url;
      }

      this.setState({
        countdown: { ...countdown, timeout: newTimeout }
      })
    }, 1000)
  }

  onRemoveMessage = (message) => {
    console.log('--> Socket.io remove message', message)
    const { messages } = this.state
    this.setState({
      messages: messages.filter(({ id }) => id !== message.id),
    })
  }

  onIsTyping = (isTyping) => {
    console.log('--> Socket.io user is typing', isTyping)
    this.setState({ isTyping })
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

  handleCountdown = (data) => {
    console.log('--> Socket.io countdown scheduled', data)
    this.socket.emit('countdown', data)
  }

  handleIsTyping = (isTyping) => {
    console.log('--> Socket.io send isTyping', isTyping)
    this.socket.emit('typing', isTyping)
  }

  render() {
    const { messages, clients, countdown, isTyping } = this.state

    const user = find(clients, { id: get(this.socket, 'id') })
    const [ chattingWith ] = clients.filter(client => client.id !== get(user, 'id'))

    if (!user || !chattingWith) {
      return (<div>Waiting users to join the chat....</div>)
    }

    return (
      <AppContainer>
        <ChatInterface
          chattingWith={chattingWith}
          user={user}
          messages={messages}
          isTyping={isTyping}

          onSendMessage={this.handleSendMessage}
          onSetNick={this.handleSetNick}
          onRemoveLast={this.handleRemoveLast}
          onCountdown={this.handleCountdown}
          onIsTyping={this.handleIsTyping}
        />

        {countdown && (
          <CountdownImage>
            <img src={clock} alt="countdown" />
            <span>Redirecting to <strong>{countdown.url}</strong> in <strong>{countdown.timeout}</strong> seconds...</span>
          </CountdownImage>
        )}
      </AppContainer>
    )
  }
}
