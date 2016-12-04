module.exports = function (express) {
    const http = require('http').Server(express);
    const socket = require('socket.io').listen(47996);
    let game = require('./game');

    socket.on('connection', function (connection) {
        console.log('a user connected: ');

        connection.on('registration', function (player) {
            console.log('registered: ', player);
            // let {nickname, uuid} = player.user;
            player.connectionId = connection.id;
            game.players.push(player);
            socket.sockets.emit('users_list_update', game.players);
        });

        connection.on('join', function (roomName) {
            game.rooms.forEach((_room, index) => {
                if (_room.name === roomName) {
                    game.rooms[index].players.push(connection.id);
                    console.log('player joined to ' + roomName);
                }
                return socket.sockets.emit('users_list_update', game.players);
            });
        });

        connection.on('disconnect', function () {
            game.players.forEach((player, index) => {
                if (player.connectionId === connection.id) {
                    game.players.splice(index, 1);
                }
                return console.log(game.players);
            });
        });
    });
};
