const webServerPORT = 81
const fs = require('fs-extra')
const spdy = require('spdy')
const http = require('http')
const appServer = require('./app')
// const server = http.createServer(appServer)

// Global variable
var GlobalUsers = []

// HTTPS server config
const serverOptions = { key: fs.readFileSync(`${__dirname}/cert/server.key`), cert: fs.readFileSync(`${__dirname}/cert/server.cert`) }
const server = spdy.createServer(serverOptions, appServer)

// Socket.io
const { io } = require('./utils/socket')
io.on('connection', socket => {
  // When connect on join-room channel
  socket.on('join-room', (roomId, userDataId, userDataName, userId) => {
    // Push user login
    if (GlobalUsers.filter(data => data.id == roomId && data.userid == userDataId).length < 1) {
      console.log(`~ ${userDataName} joinin room id "${roomId}"`)
      GlobalUsers.push({ id: roomId, userid: userDataId, name: userDataName })
    }

    // Join & broadcast
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', { id: userId, name: userDataName, data: GlobalUsers.filter(data => data.id == roomId) })
    
    socket.on('online-user', (roomId) => {
      socket.to(roomId).broadcast.emit('user-connected', { id: userId, name: userDataName, data: GlobalUsers.filter(data => data.id == roomId) })
    })

    // When disconnect
    socket.on('disconnect', () => {
      // Push new user
      GlobalUsers = GlobalUsers.filter(item => item.userid !== userDataId)
      socket.to(roomId).broadcast.emit('user-disconnected', { id: userId, name: userDataName, data: GlobalUsers.filter(data => data.id == roomId) })
    })
  })
})

io.attach(server)

// PeerJS server
const { PeerServer } = require('peer')
const peerServer = PeerServer({ port: 9000, ssl: serverOptions, proxied: true })

// Start listen
server.listen(webServerPORT, () => console.info(`App server listening on port ${webServerPORT}`))