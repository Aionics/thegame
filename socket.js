module.exports = function (express) {
    const http = require('http').Server(express);
    const socket = require('socket.io').listen(47996);
    let game = require('./game');

    socket.on('connection', function (connection) {
        console.log('a user connected: ');

        connection.on('join', function (data) {
            game.rooms.forEach((_room, index) => {
                if (_room.name === data.room) {
                    game.rooms[index].players.push(data.user);
                    connection.emit('joined', game.rooms[index]);
                    console.log('player joined to ' + data.room);
                }
                return socket.sockets.emit('users_list_update', {
                    players: game.players
                });
            });
        });
    });
};
