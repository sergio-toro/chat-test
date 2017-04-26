const ChatServer = require('./lib/ChatServer')

let chat

function start (config, app) {
  chat = new ChatServer(config.io.port)

  console.log('ChatServer started on port', config.io.port)
}

exports.start = start
