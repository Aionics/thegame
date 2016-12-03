module.exports = function (express) {
const http = require('http').Server(express);
const socket = require('socket.io').listen(3001);
let game = require('./game');

    socket.on('connection', function(connection) {
    	console.log('a user connected: ');

    	connection.on('registration', function (player) {
            console.log('recieved: ', player);
            game.players.push(player);
            connection.emit('registration-answer', game.players);
    	})

        connection.on('disconnect', function () {
            console.log('disconnected');
        });
    })


    socket.on('event', function(data){
    	console.log('resieved data: ', data);
    	console.log(data);
    });

    socket.on('event', function(data){});
    socket.on('disconnect', function(){});
};
