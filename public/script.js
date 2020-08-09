const socket  = io('/')
const VideoGrid = document.getElementById('videogrid')
const myPeer = new Peer(undefined, {
    host : '/',
    port : '3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}


navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    addVideo(myVideo,stream)


    myPeer.on('call',call =>{
        call.answer(stream)
        const Video = document.createElement('video')
        call.on('stream',userVideoStream => {
            addVideo(Video,userVideoStream)
        })
    })

    socket.on('user-connected',userId => {
        connectTonewUser(userId,stream)
    })
   
})
socket.on('user-disconnected',userId => {
  console.log(userId )
  if(peers[userId])peers[userId].close()
})

myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID, id)
})

function connectTonewUser(userId,stream){
    const call = myPeer.call(userId,stream)
    const Video = document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideo(Video,userVideoStream)
    })
    call.on('close', ()=>{
        Video.remove()
    })

    peers[userId] = call
}

// socket.on('user-connected',userId=>{
//     console.log('User Connected : ' + userId)
// })

function addVideo(Video,stream){
    Video.srcObject = stream
    Video.addEventListener('loadedmetadata',() => {
        Video.play()
    })
    VideoGrid.append(Video)
}