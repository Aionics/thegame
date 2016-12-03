var renderer = PIXI.autoDetectRenderer(256, 256);
renderer.backgroundColor = 0x061639;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

var ready = false;
var prepare = false;
var stage = new PIXI.Container();
var circle = '';


// >>>>>>>>>>>>>>>>>>>>>>>>>
function request(url, data, success) {
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'post',
        async: true,
        data: data,
        success: function (data) { success(data); },
        error: function () {}
    });
}

var gamesList = {
    openGames: ko.observableArray([]),
    players: ko.observableArray([])
}
gamesList.loadGames = function () {
    request('/api/loadall', null, function (rooms) {
        gamesList.openGames(rooms);
    });
};

gamesList.enterRoom = function (room) {
    socket.send({
		action: 'entering',
		user: iam,
        target: room.name
	});
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4();
}

var iam = {
    nickName: 'Aion',
	uuid: guid().toString()
}
var socket = io('127.0.01:3001');

socket.on('connect', function() {
	socket.emit('registration', {
		user: iam
	});
})

socket.on('registration-answer', function (players) {
    gamesList.players(players);
})

document.onkeydown = function (e) {

    e = e || window.event;

    var dir = 'none';
    if (e.keyCode == '38') {
    	// up arrow
    	dir = 'up';
    }
    else if (e.keyCode == '40') {
        // down arrow
        dir = 'down';
    }
    else if (e.keyCode == '37') {
       // left arrow
       dir = 'left';
    }
    else if (e.keyCode == '39') {
       // right arrow
       dir = 'right';
    }
        socket.send({
        	action: 'pos-update',
        	uuid: iam.uuid,
        	dir: dir
        })

}

$(document).ready(function() {

	document.body.appendChild(renderer.view);

	PIXI.loader.add([
		'img/square.png',
		'img/circle.jpg'
	]).load(function () {
		ready = true;
	});

    ko.applyBindings(gamesList);
    gamesList.loadGames();

    $('.modal').modal({
        dismissible: false
    });
    $('#open_games').modal('open');
});
