import React, { PropTypes } from 'react'
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
`
const InputContainer = styled.div`
  padding: 10px;
`
const ChatInterface = (props) => {
  const {
    messages,
    chattingWith,
    user,
    onSendMessage,
    onSendThinkMessage,
    onSetNick,
    onRemoveLast,
  } = props

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
      </MessagesContainer>
      <InputContainer>
        <ChatInput
          onSendMessage={onSendMessage}
          onSendThinkMessage={onSendThinkMessage}
          onSetNick={onSetNick}
          onRemoveLast={onRemoveLast}
        />
      </InputContainer>
    </ChatContainer>
  )
}

const userIdShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
])
const userShape = PropTypes.shape({
  id: userIdShape.isRequired,
  nickname: PropTypes.string,
})

ChatInterface.propTypes = {
  chattingWith: userShape.isRequired,
  user: userShape.isRequired,

  messages: PropTypes.arrayOf(PropTypes.shape({
    userId: userIdShape,
    message: PropTypes.string,
    modifiers: PropTypes.arrayOf(
      PropTypes.oneOf(['think'])
    ),
  })),
  onSendMessage: PropTypes.func,
  onSendThinkMessage: PropTypes.func,
  onSetNick: PropTypes.func,
  onRemoveLast: PropTypes.func,
}

ChatInterface.defaultProps = {
  messages: [],
  onSendMessage: noop,
  onSendThinkMessage: noop,
  onSetNick: noop,
  onRemoveLast: noop,
}

export default ChatInterface
