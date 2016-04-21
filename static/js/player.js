const rootVideoMaster = 'breal.local:4000'
var socketVideoMaster = io.connect(rootVideoMaster + '/masterVideo')
var player = document.getElementById("player");
var fullScreen = false

playIdle()

socketVideoMaster.on('playVideo', function(_data) {
	player.loop = false
	player.src = _data
	player.play()
	player.addEventListener('ended', function() {
			playIdle()
		}, false)
});

key('enter', function() {
	if (!fullScreen) {
		enterFullscreen()
	} else {
		exitFullscreen()
	}
});

function playIdle(){
	player.src = "idle.mp4"
	player.play()
	player.loop = true
}

function udpateProgress() {
	value = player.currentTime / player.duration
	socketVideoMaster.emit('videoProgress', value)
	if (value == 1) {
		console.log("Done");
	}
}