import React, { Component } from 'react'
import io from 'socket.io-client'
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
      console.log('--> Socket.io connected', this.socket)
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
    })
  }

  render() {
    return (
      <ChatInterface
        chattingWith={{ id: 2, nickname: 'Hola mundo!' }}
        user={{ id: 1, nickname: null }}
        messages={[
          { userId: 1, message: 'Hey, what\'s up man? (smile)' },
          { userId: 2, message: 'Oh it\'s you?' },
          { userId: 1, message: 'Do you want a beer?' },
          { userId: 2, message: 'Yep! Where do you want to go? Do you know that new place in the city center?' },
          { userId: 1, message: 'Green Beer, right?' },
          { userId: 1, message: 'Sounds cool, let\'s go!' },
        ]}

        onSendMessage={(data) => console.log('send message', data)}
        onSendThinkMessage={(data) => console.log('send think message', data)}
        onSetNick={(data) => console.log('set nickname', data)}
        onRemoveLast={(data) => console.log('remove last', data)}
      />
    )
  }
}
