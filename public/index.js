var renderer = PIXI.autoDetectRenderer(256, 256);
renderer.backgroundColor = 0x061639;
renderer.view.style.position = 'absolute';
renderer.view.style.display = 'block';
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

var stage = new PIXI.Container();

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4();
}

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
    players: ko.observableArray([]),
    myName: ko.observable()
};

gamesList.loadGames = function () {
    request('/api/loadall', null, function (rooms) {
        gamesList.openGames(rooms);
    });
};

gamesList.registration = function () {
    $('#registration').modal('close');
    $('#open_games').modal('open');
};

gamesList.joinToRoom = function (room) {
    console.log(room);
    socket.emit('join', {
        room: room.name,
        user: Iam
    });
};

var Player = function () {
    this.uuid = guid().toString();
    this.nickName = gamesList.myName();
};

var Iam = new Player();

var socket = io('localhost:47996');
socket.on('users_list_update', function (players) {
    console.log(players);
    gamesList.players(players);
});

socket.on('joined', function (room) {
    Game = room;
    initGame();
});

$(document).ready(function () {
    document.body.appendChild(renderer.view);

    PIXI.loader.add([
		'img/square.png',
		'img/circle.jpg'
	]).load(function () {
        ready = true;
    });

    var bg = PIXI.Texture.fromImage('img/bg.png');
    window.background = new PIXI.extras.TilingSprite(bg, window.innerWidth, window.innerHeight);
    background.position.x = 0;
    background.position.y = 0;
    background.tilePosition.x = 0;
    background.tilePosition.y = 0;
    stage.addChild(background);

    ko.applyBindings(gamesList);
    gamesList.loadGames();

    $('.modal').modal({
        dismissible: false
    });
    $('#registration').modal('open');
});

$(window).resize(function () {
    newWidth = window.innerWidth;
    newHeight = window.innerHeight;

    renderer.view.style.width = newWidth + 'px';
    renderer.view.style.height = newHeight + 'px';
    renderer.resize(newWidth, newHeight);

    background.width = newWidth;
    background.height = newHeight;
});
