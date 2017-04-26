import React from 'react'
import { storiesOf, action, linkTo } from '@kadira/storybook'

import styled from 'styled-components'
import ChatInput from './ChatInput'
import Message from './Message'
import Header from './Header'

import '../App.css'

const Container = styled.div`
  background: #ECE5DD;
  padding: 50px;
`

storiesOf('ChatInput', module)
  .add('basic usage', () => (
    <Container>
      <ChatInput
        onSendMessage={action('send message')}
        onSendThinkMessage={action('send think message')}
        onSetNick={action('set nickname')}
        onRemoveLast={action('remove last')}
      />
    </Container>
  ))

storiesOf('Header', module)
  .add('simple header', () => (
    <Container>
      <Header>
        Anonimous user
      </Header>
    </Container>
  ))

storiesOf('Message', module)
  .add('Incoming message', () => (
    <Container>
      <Message>Hello Nick!</Message>
    </Container>
  ))
  .add('Outgoing message', () => (
    <Container>
      <Message isOutgoing>Hey, what's up man? (smile)</Message>
    </Container>
  ))
  .add('Conversation', () => (
    <Container>
      <Message isOutgoing>Hey, what's up man? (smile)</Message>
      <Message>Oh it's you?</Message>
      <Message isOutgoing>Do you want a beer?</Message>
      <Message>Yep! Where do you want to go? Do you know that new place in the city center?</Message>
      <Message isOutgoing>Green Beer, right? Sounds cool, let's go!</Message>
    </Container>
  ))
