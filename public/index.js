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


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4();
}

var iam = {
	uuid: guid().toString()
}
var socket = io('192.168.0.3:3001');

socket.on('connect', function() {
	socket.send({
		action: 'registration',
		uuid: iam.uuid
	});
})

socket.on('message', function(data){
	if (ready) {
		data = JSON.parse(data);
		if (data.status == 'notready') {
			$('.test').text('Ждем второго');
		}else{
			$('.test').text('');
			if ( !prepare ) {
				prepare = true;
				window.players = data.players;

				var players = window.players
				for (uuid in players) {
					if (uuid == iam.uuid) {
						iam.pos = players[uuid].pos;
					}
					console.log(players[uuid].type);
					var sprite = new PIXI.Sprite(
    					PIXI.loader.resources['img/' + players[uuid].type].texture
					);
					players[uuid].sprite = sprite;
					stage.addChild(sprite);
				}
			} else {
				var players = window.players
				for (uuid in players) {
					players[uuid].sprite.position.set(data.players[uuid].pos.x, data.players[uuid].pos.y);
				}
				console.log(players);
				renderer.render(stage);
			}		
		}
	}
});

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
	})
});

