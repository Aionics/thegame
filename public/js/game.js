var Game = {};

function initGame() {
    console.log(Game, stage);
    $('#open_games').modal('close');

    Game.players.forEach(function (player, index) {
        Game.players[index].model = new PIXI.Sprite(
            PIXI.loader.resources['img/circle.jpg'].texture
        );
        var model = Game.players[index].model;
        model.position.set(200, 200);
        console.log('PLAYER: ', Game.players[index]);
        stage.addChild(model);
    });
    setInterval(TickCalc, 1000 / 60);
    setInterval(TickRender, 1000 / 60);
}


function TickCalc() {
    background.tilePosition.x -= 0.5;
}

function TickRender() {
    renderer.render(stage);
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        'keydown', key.downHandler.bind(key), false
    );
    window.addEventListener(
        'keyup', key.upHandler.bind(key), false
    );
    return key;
}
