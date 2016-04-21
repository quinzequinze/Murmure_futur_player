const rootMaster = 'vigo.local:4000'
const rootVideoMaster = 'breal.local:4000'
var config
var inited = false
var user = {}
var tag = {}
var sound = {}
var display = {}
    //
var socketMaster = io.connect(rootMaster + '/master')
var socketVideoMaster = io.connect(rootVideoMaster + '/masterVideo')

var videoList = []
var fullScreen = false
    //

                                                                 
 // _|      _|    _|_|      _|_|_|  _|_|_|_|_|  _|_|_|_|  _|_|_|    
 // _|_|  _|_|  _|    _|  _|            _|      _|        _|    _|  
 // _|  _|  _|  _|_|_|_|    _|_|        _|      _|_|_|    _|_|_|    
 // _|      _|  _|    _|        _|      _|      _|        _|    _|  
 // _|      _|  _|    _|  _|_|_|        _|      _|_|_|_|  _|    _|  
                                                                 
                                                                 

socketMaster.on('init', init)
socketMaster.on('updateUser', updateUser)
socketMaster.on('updateSound', updateSound)
socketMaster.on('updateTag', updateTag)

function updateTag(_tag) {
    tag = _tag
    drawTag()
}

function updateUser(_user) {
    user = _user
}

function updateSound(_sound) {
    sound = _sound
    drawSound()
}

function drawTag() {
    for (var key in display.user) {
        if (tag[key]) {
            display.user[key].classList.remove('hidden')
            display.user[key].style.top = webUnit(tag[key]).y + 'px'
            display.user[key].style.left = webUnit(tag[key]).x + 'px'
        } else {
            display.user[key].classList.add('hidden')
        }
    }
}

function drawSound() {
    var masterMap = document.getElementById("masterMap")
    for (var key in display.sound) {
        display.sound[key].parentNode.removeChild(display.sound[key]);
    }
    for (var key in sound) {
        if (!document.getElementById(key)) {
            display.sound[key] = document.createElement("div")
            display.sound[key].id = key
            display.sound[key].classList.add('circle')
            display.sound[key].classList.add('sound')
            display.sound[key].style.top = webUnit(sound[key]).y + 'px'
            display.sound[key].style.left = webUnit(sound[key]).x + 'px'
            if (sound[key].valid == true) {
                display.sound[key].style.backgroundImage = 'url("valid_sound.svg")';
            }
            masterMap.appendChild(display.sound[key])
        }
    }
}

function init(_config) {
    if (inited) return
    var masterMap = document.getElementById("masterMap")
    var manager = document.getElementById("manager")
    var validator = document.getElementById("validator")
    config = _config
    display.user = []
    display.sound = []
    key('enter', function() {
        if (!fullScreen) {
            enterFullscreen()
        } else {
            exitFullscreen()
        }
    });
    for (var i = 1; i <= config.TAG_NUMBER; i++) {
        display.user[i] = document.createElement("div")
        display.user[i].id = i
        display.user[i].classList.add('circle')
        display.user[i].classList.add('hidden')
        display.user[i].classList.add('user')

        display.user[i].onclick = function(e) {
            socketVideoMaster.emit('videoToPlay', videoList[getRandomVideoIndex()])
        }

        masterMap.appendChild(display.user[i])
        display.user[i].textContent = i
    }

    inited = true
}

function webUnit(_tag) {
    var masterMap = document.getElementById("masterMap")
    return {
        x: _tag.x * masterMap.offsetWidth / config.ROOM_WIDTH,
        y: _tag.y * masterMap.offsetHeight / config.ROOM_LENGTH,
        z: 170,
        angle: _tag.angle
    }
}
                                                                                                                   
 // _|      _|    _|_|      _|_|_|  _|_|_|_|_|  _|_|_|_|  _|_|_|        _|      _|  _|_|_|  _|_|_|    _|_|_|_|    _|_|    
 // _|_|  _|_|  _|    _|  _|            _|      _|        _|    _|      _|      _|    _|    _|    _|  _|        _|    _|  
 // _|  _|  _|  _|_|_|_|    _|_|        _|      _|_|_|    _|_|_|        _|      _|    _|    _|    _|  _|_|_|    _|    _|  
 // _|      _|  _|    _|        _|      _|      _|        _|    _|        _|  _|      _|    _|    _|  _|        _|    _|  
 // _|      _|  _|    _|  _|_|_|        _|      _|_|_|_|  _|    _|          _|      _|_|_|  _|_|_|    _|_|_|_|    _|_|    
                                                                                                                       
                                                                                                                       

socketVideoMaster.on('videoList', updateVideoList)
socketVideoMaster.on('videoProgress', udpateProgress)

function updateVideoList(_data){
    videoList = _data;
}

function getRandomVideoIndex(){
    return randomInt(0, videoList.length-1)
    
}

function udpateProgress(_data) {
    var progressbar = document.getElementById('seekbar');
    progressbar.value = _data
}

//