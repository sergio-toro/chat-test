import React, { Component } from 'react';
import ChatInterface from './components/ChatInterface'

import './App.css'

export default class App extends Component {
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
