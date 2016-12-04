var Game = {};

function initGame() {
    console.log(Game, stage);
    $('#open_games').modal('close');
    Game.players.forEach(function (player, index) {
        Game.players[index].model = new PIXI.Sprite(
            PIXI.loader.resources['img/circle.jpg'].texture
        );
        console.log('PLAYER: ', Game.players[index]);
        stage.addChild(Game.players[index].model);
    });
    setInterval(TickCalc, 1000 / 60);
    setInterval(TickRender, 1000 / 60);
}


function TickRender() {

}

function TickRender() {
    renderer.render(stage);
}
