const io = require('socket.io-client')
const config = require('../config')

const SOCKET_URL = 'ws://localhost:' + config.io.port

exports.getSocketClient = () => io(SOCKET_URL)

