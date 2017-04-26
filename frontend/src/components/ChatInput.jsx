import React, { PropTypes } from 'react'
import styled from 'styled-components'

import { noop, startsWith } from 'lodash'

const ChatInputContainer = styled.div`
`
const StyledTextarea = styled.textarea`
  border: 0;
  border-radius: 8px;
  display: block-block;
  padding: 10px 12px;
  width: calc(80% - 24px);
  resize: none;

  background-color: #FFF;
  box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 0.2);
`
const SendButton = styled.button`
  border: 0;
  background-color: #128C7E;
  color: white;
  padding: 10px 12px;
  width: calc(20% - 20px);
  margin-left: 20px;
  display: inline-block;
  vertical-align: top;
  box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 0.2);

  &:not([disabled]):hover {
    background-color: #075E54;
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
  }
`

export default class ChatInput extends React.Component {

  static propTypes = {
    onSendMessage: PropTypes.func,
    onSetNick: PropTypes.func,
    onRemoveLast: PropTypes.func,
    onCountdown: PropTypes.func,
    onIsTyping: PropTypes.func,
  }
  static defaultProps = {
    onSendMessage: noop,
    onSetNick: noop,
    onRemoveLast: noop,
    onCountdown: noop,
    onIsTyping: noop,
  }

  constructor() {
    super()
    this.state = {
      message: '',
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { onIsTyping } = this.props
    const { message } = this.state
    const { message: prevMessage } = prevState

    if (!message.length && prevMessage.length) {
      onIsTyping(false)
    } else if (message.length && !prevMessage.length) {
      onIsTyping(true)
    }
  }

  handleChange = (event) => {
    this.setState({ message: event.target.value })
  }

  handleKeyEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.handleSubmit()
    }
  }

  handleSubmit = () => {
    const { onSendMessage, onSetNick, onRemoveLast, onCountdown } = this.props
    const message = this.state.message.trim()

    if (!message.length) {
      return
    }

    switch (true) {
      case startsWith(message, '/nick '):
        onSetNick(message.replace('/nick ', ''))
        break;
      case startsWith(message, '/think '):
        onSendMessage({
          message: message.replace('/think ', ''),
          modifiers: ['think']
        })
        break;
      case startsWith(message, '/countdown '):
        const regex = /^\/countdown (\d) (https?:\/\/.{3,})$/g
        const [ , timeout, url ] = regex.exec(message)
        if (timeout && url) {
          onCountdown({ timeout, url })
        }
        break;
      case startsWith(message, '/highlight '):
        onSendMessage({
          message: message.replace('/highlight ', ''),
          modifiers: ['highlight']
        })
        break;
      case startsWith(message, '/oops'):
        onRemoveLast()
        break;
      default:
        onSendMessage({ message, modifiers: []})
        break;
    }

    this.setState({ message: '' })
  }

  render() {
    const { message } = this.state

    return (
      <ChatInputContainer>
        <StyledTextarea
          name="message"
          value={message}
          placeholder="Send a message..."
          onChange={this.handleChange}
          onKeyDown={this.handleKeyEnter}
        />
        <SendButton
          disabled={message.length === 0}
          onClick={this.handleSubmit}
        >
          Send
        </SendButton>
      </ChatInputContainer>
    )
  }
}
