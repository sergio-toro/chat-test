const socketIo = require('socket.io')

let io

function start (config, app) {
  io = socketIo(config.io.port)

  console.log('Socket.io started on port', config.io.port)
}

exports.start = start
exports.io = io
