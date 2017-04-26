const config = require('./config')
const chat = require('./src/chat')

console.log('Starting chat server...')
chat.start(config)

console.log('Successfully started chat server. Waiting for incoming connections...')
