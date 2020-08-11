const peers = {}
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userData => {
    connectToNewUser(userData.id, stream)
    connectToListOnline(userData.data)
  })

  socket.on('user-disconnected', userData => {
    connectToListOnline(userData.data)
    if (peers[userData.id]) peers[userData.id].close()
  })
})

function connectToListOnline(userData) {
  var innerHTML = []
  userData.map(item => {
    innerHTML += `
      <li class="list-dashboard2">
        <div class="col-avatar2">
          <div class="avatar-user-list avatar1"></div>
        </div>
        <div class="col-text2">
          <h2>${item.name}</h2>
        </div>
        <div class="col-menu2">
          <i class="fa fa-flag" aria-hidden="true"></i>
        </div>
      </li>
    `
  })
  document.getElementById('onlineuser').innerHTML = innerHTML
}

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => { addVideoStream(video, userVideoStream) })
  call.on('close', () => { video.remove() })
  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => { video.play() })
  videoGrid.append(video)
}

const myPeer = new Peer(undefined, { host: '/', port: '9000', secure: true })
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, USER_ID, USER_NAME, id)
  setInterval(() => { socket.emit('online-user', ROOM_ID) }, 1000*3)
})