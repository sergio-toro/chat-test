import React from 'react'
import { storiesOf, action, linkTo } from '@kadira/storybook'

import styled from 'styled-components'
import ChatInput from './ChatInput'

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


