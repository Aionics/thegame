const express = require('express');
const app = express();

const http = require('http').Server(express);
const socket = require('socket.io').listen(3001);

require('./api')(app);

let players = {};
let data = {
	status: 'notready'
};
let who = true;

app.set('json spaces', 40);
app.use('/', express.static('./public'));
app.use('/admin', express.static('./admin'));

app.get('/admin', function (req, res, next) {
	res.sendFile('admin.html', {root: __dirname + '/admin'} )
})

app.get('/*', function (req, res, next) {
    res.sendFile("index.html", { root: __dirname + "/public"} )
});

socket.on('connection', function(connection) {
	console.log('a user connected: ');

	connection.on('message', function (data) {
		console.log('recieved some message: ', data);
		if (data.action == 'registration') {
			players[data.uuid] = {
				pos: {
					x: 0,
					y: 0
				},
				type: who ? 'square.png' : 'circle.jpg'
			}
			who = !who;
			let _data = {
				status: 'notready',
				players: players
			}
			console.log('data-registration: ', _data)
			connection.json.send(JSON.stringify( _data ));
		}

		if (data.action == 'pos-update') {
			for (uuid in players) {
				if (data.uuid == uuid) {
					if (data.dir == 'up') {
						players[uuid].pos.x = players[uuid].pos.x;
						players[uuid].pos.y = players[uuid].pos.y - 2;
					}
					if (data.dir == 'down') {
						players[uuid].pos.x = players[uuid].pos.x;
						players[uuid].pos.y = players[uuid].pos.y + 2;
					}
					if (data.dir == 'left') {
						players[uuid].pos.x = players[uuid].pos.x - 2;
						players[uuid].pos.y = players[uuid].pos.y;
					}
					if (data.dir == 'right') {
						players[uuid].pos.x = players[uuid].pos.x + 2;
						players[uuid].pos.y = players[uuid].pos.y;
					}

				}
			}
		}
	})

	setInterval(function () {
		if (Object.keys(players).length == 2) {
			data.status = 'ready';
			data.players = players;
			connection.json.send(JSON.stringify(data));
		}
	}, 1000/60);


})

socket.on('event', function(data){
	console.log('resieved data: ', data);
	console.log(data);
});

socket.on('event', function(data){});
socket.on('disconnect', function(){});

app.listen(3000, function () {
    console.log('listening on 3000');
});
