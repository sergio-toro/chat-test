import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { noop } from 'lodash'

import Header from './Header'
import Message from './Message'
import ChatInput from './ChatInput'

const ChatContainer = styled.div`
  position: relative;
  background: #ECE5DD;
  height: 100%;
`

const MessagesContainer = styled.div`
  position: relative;
  padding: 10px;
  // 38px header height
  // 80px chat input height
  // 20px message container padding
  height: calc(100% - 38px - 80px - 20px);
  overflow-y: auto;
`

const InputContainer = styled.div`
  padding: 10px;
`

const MessagesEnd = styled.div`
  clear: both;
`


const IsTypingMessage = styled.div`
  position: absolute;
  left: 22px;
  top: calc(100% - 18px);
  font-style: italic;
  font-size: 12px;
  color: #8a8a8a;
`


const userIdShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
])
const userShape = PropTypes.shape({
  id: userIdShape.isRequired,
  nickname: PropTypes.string,
})

export default class ChatInterface extends React.Component {
  static propTypes = {
    chattingWith: userShape.isRequired,
    user: userShape.isRequired,

    messages: PropTypes.arrayOf(PropTypes.shape({
      userId: userIdShape,
      message: PropTypes.string,
      modifiers: PropTypes.array,
    })),
    isTyping: PropTypes.bool,
    onSendMessage: PropTypes.func,
    onSetNick: PropTypes.func,
    onRemoveLast: PropTypes.func,
    onFadeLast: PropTypes.func,
    onCountdown: PropTypes.func,
    onIsTyping: PropTypes.func,
  }

  static defaultProps = {
    messages: [],
    isTyping: false,
    onSendMessage: noop,
    onSetNick: noop,
    onRemoveLast: noop,
    onFadeLast: noop,
    onCountdown: noop,
    onIsTyping: noop,
  }
  constructor (props) {
    super(props)

    this.messagesEndRef = null
  }


  componentDidUpdate () {
    this.scrollToBottom()
  }

  scrollToBottom () {
    const node = ReactDOM.findDOMNode(this.messagesEndRef)
    node.scrollIntoView({ behavior: 'smooth' })
  }

  render () {
    const {
      messages,
      chattingWith,
      user,
      isTyping,
      onSendMessage,
      onSetNick,
      onRemoveLast,
      onFadeLast,
      onCountdown,
      onIsTyping,
    } = this.props

    return (
      <ChatContainer>
        <Header>{chattingWith.nickname || 'Unknown user'}</Header>
        <MessagesContainer>
          {messages.map(({ message, userId, modifiers }, index) => (
            <Message
              key={index}
              isOutgoing={userId === user.id}
              modifiers={modifiers}
            >
              {message}
            </Message>
          ))}
          {isTyping && <IsTypingMessage>User is typing...</IsTypingMessage>}
          <MessagesEnd ref={(el) => { this.messagesEndRef = el }}></MessagesEnd>
        </MessagesContainer>
        <InputContainer>
          <ChatInput
            onSendMessage={onSendMessage}
            onSetNick={onSetNick}
            onRemoveLast={onRemoveLast}
            onFadeLast={onFadeLast}
            onCountdown={onCountdown}
            onIsTyping={onIsTyping}
          />
        </InputContainer>
      </ChatContainer>
    )
  }
}





