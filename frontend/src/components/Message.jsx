import React, { PropTypes } from 'react'
import styled from 'styled-components'

const MessageContainer = styled.div`
  clear: both;
  overflow: auto;
  padding: 10px 15px;
`
// arrow http://codepen.io/supro/pen/EdrDL
const StyledMessage = styled.div`
  border-radius: 8px;
  display: inline-block;
  padding: 10px 12px;
  position: relative;
  white-space: pre-wrap;

  background-color: #FFF;
  box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 0.2);
  float: left;
  max-width: 300px;

  &:before {
    content: '';
    position: absolute;
    border-top: 16px solid rgba(0, 0, 0, 0.15);
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;

    margin: -9px 0 0 -16px;
    left: 0;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    border-left: 17px solid transparent;
    border-right: 17px solid transparent;

    left: 0;
    margin: 0 0 0 -15px;
    border-top: 17px solid #FFF;
  }

  &.outgoing {
    background-color: #DCF8C6;
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.2);
    float: right;

    &:before {
      margin: -9px -16px 0 0;
      right: 0;
      left: auto;
    }
    &:after {
      left: auto;
      right: 0;
      margin: 0 -15px 0 0;
      border-top: 17px solid #DCF8C6;
    }
  }

  &.think {
    color: #8a8a8a;
  }

  &.highlight {
    font-size: calc(100% + 10%);
    // TODO: make the background 10% darker
  }
`

const Message = ({ children, modifiers, isOutgoing }) => (
  <MessageContainer>
    <StyledMessage className={[isOutgoing && 'outgoing', ...modifiers].join(' ')}>
      {children}
    </StyledMessage>
  </MessageContainer>
);

Message.propTypes = {
  children: PropTypes.string.isRequired,
  isOutgoing: PropTypes.bool,
  modifiers: PropTypes.arrayOf(
    PropTypes.oneOf(['think', 'highlight'])
  ),
}

Message.defaultProps = {
  isOutgoing: false,
}

export default Message
