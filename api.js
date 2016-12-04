const bodyParser = require('body-parser');
let game = require('./game');

module.exports = function (api) {
    api.set('json spaces', 40);
    api.use(bodyParser.urlencoded({ extended: false }));
    api.use(bodyParser.json());

    api.post('/api/loadall', function (req, res, next) {
        if (!req.xhr) return next();

        res.json(game.rooms);
    });

    api.post('/api/newroom', function (req, res, next) {
        if (!req.xhr) return next();

        let name = req.body.name;
        game.rooms.push({
            name: name
        });
        res.json({
            error: null,
            data: 'ok'
        });
    });

    api.post('/api/removeroom', function (req, res, next) {
        if (!req.xhr) return next();

        let name = req.body.name;
        game.rooms.forEach((room, index) => {
            if (room.name == name) {
                game.rooms.splice(index, 1);
                return;
            }
        });
        res.json({
            error: null,
            data: 'ok'
        });
    });
};
