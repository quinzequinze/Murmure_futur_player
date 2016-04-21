const express = require('express')
const app = require('express')()
const http = require('http')
const server = http.Server(app)
const io = require('socket.io')(server)
const fs = require('fs')
const colors = require('colors/safe')
const masterVideo = io.of('/masterVideo')

var db = require('origindb')(__dirname + '/static/db')

colors.setTheme({
    server: ['cyan', 'bold'],
    client: ['magenta', 'bold'],
})

app.use(express.static(__dirname + '/static/css'))
app.use(express.static(__dirname + '/static/js'))
app.use(express.static(__dirname + '/static/img'))
app.use(express.static(__dirname + '/static/video'))


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/masterVideo.html')
})
app.get('/player', function(req, res) {
    res.sendFile(__dirname + '/player.html')
})

server.listen(4000, function() {
    console.log(colors.server('#server [listening : localhost:4000]'))
})

masterVideo.on('connection', function(socket) {
    console.log(colors.client('#client [connected]'))
    fs.readFile(__dirname + '/static/video/videoList.txt', function(err, data) {
        if (err) throw err;

        var videoListArray = data.toString().split("\n")
        masterVideo.emit("videoList", videoListArray)
    });
    socket.on('videoToPlay', playVideo)
    socket.on('videoProgress', udpateProgress)
    
})

function playVideo (_videoId){
    masterVideo.emit("playVideo", _videoId)
}
function udpateProgress (_videoProgress){
    masterVideo.emit("videoProgress", _videoProgress)
}