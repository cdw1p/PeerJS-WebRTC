const Server = require('socket.io')
const io = new Server()

var Socket = {
  emit: function (event, data) {
    io.sockets.emit(event, data)
  }
}

exports.Socket = Socket
exports.io = io