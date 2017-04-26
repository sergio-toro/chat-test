import React from 'react'
import { storiesOf, action, linkTo } from '@kadira/storybook'
import Button from './Button'
import Welcome from './Welcome'


import styled from 'styled-components'
import ChatInput from './ChatInput'

import '../App.css'

const Container = styled.div`
  background: #ECE5DD;
  padding: 50px;
`

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

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

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

