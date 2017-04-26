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
      modifiers: PropTypes.arrayOf(
        PropTypes.oneOf(['think', 'highlight'])
      ),
    })),
    onSendMessage: PropTypes.func,
    onSetNick: PropTypes.func,
    onRemoveLast: PropTypes.func,
  }

  static defaultProps = {
    messages: [],
    onSendMessage: noop,
    onSetNick: noop,
    onRemoveLast: noop,
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
      onSendMessage,
      onSetNick,
      onRemoveLast,
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
          <MessagesEnd ref={(el) => { this.messagesEndRef = el }}></MessagesEnd>
        </MessagesContainer>
        <InputContainer>
          <ChatInput
            onSendMessage={onSendMessage}
            onSetNick={onSetNick}
            onRemoveLast={onRemoveLast}
          />
        </InputContainer>
      </ChatContainer>
    )
  }
}





