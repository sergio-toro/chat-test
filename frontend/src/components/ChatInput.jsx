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
    onSendThinkMessage: PropTypes.func,
    onSetNick: PropTypes.func,
    onRemoveLast: PropTypes.func,
  }
  static defaultProps = {
    onSendMessage: noop,
    onSendThinkMessage: noop,
    onSetNick: noop,
    onRemoveLast: noop,
  }

  constructor() {
    super()
    this.state = {
      message: '',
    }
  }

  handleChange = (event) => {
    this.setState({
      message: event.target.value.trim()
    })
  }

  handleSubmit = () => {
    const { onSendMessage, onSendThinkMessage, onSetNick, onRemoveLast } = this.props
    const { message } = this.state

    switch (true) {
      case startsWith(message, '/nick '):
        return onSetNick(message.replace('/nick ', ''))
      case startsWith(message, '/think '):
        return onSendThinkMessage(message.replace('/think ', ''))
      case startsWith(message, '/oops'):
        return onRemoveLast()
      default:
        return onSendMessage(message)
    }
  }

  render() {
    const { message } = this.state

    return (
      <ChatInputContainer>
        <StyledTextarea
          name="message"
          placeholder="Send a message..."
          onChange={this.handleChange}
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
