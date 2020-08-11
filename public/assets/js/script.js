var peers = {}
var socket = io('/')
var context = new (window.AudioContext || window.webkitAudioContext)()
var filter, compressor, mediaStreamSource
var videoGrid = document.getElementById('video-grid')
var myVideo = document.createElement('video')
myVideo.muted = true
myVideo.volume = 0

navigator.mediaDevices.getUserMedia({ video: false, audio: true }, initAudio).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => { addVideoStream(video, userVideoStream) })
  })

  socket.on('user-connected', userData => {
    connectToNewUser(userData.id, stream)
    connectToListOnline(userData.data)
    socket.emit('online-user', ROOM_ID)
  })

  socket.on('user-disconnected', userData => {
    connectToListOnline(userData.data)
    socket.emit('online-user', ROOM_ID)
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

function initAudio(stream) {
  compressor = context.createDynamicsCompressor()
  compressor.threshold.value = -50
  compressor.knee.value = 40
  compressor.ratio.value = 12
  compressor.reduction.value = -20
  compressor.attack.value = 0
  compressor.release.value = 0.25

  filter = context.createBiquadFilter()
  filter.Q.value = 8.30
  filter.frequency.value = 355
  filter.gain.value = 3.0
  filter.type = 'bandpass'
  filter.connect(compressor)

  compressor.connect(context.destination)
  filter.connect(context.destination)

  mediaStreamSource = context.createMediaStreamSource(stream)
  mediaStreamSource.connect(filter)
}

const myPeer = new Peer(undefined, { host: '/', port: '9000', secure: true })
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, USER_ID, USER_NAME, id)
})