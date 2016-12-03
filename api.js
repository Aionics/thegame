const bodyParser = require("body-parser");

module.exports = function (api) {
    api.set('json spaces', 40);
    api.use(bodyParser.urlencoded({ extended: false }));
    api.use(bodyParser.json());

    api.post('/api/newroom', function (req, res, next) {
        console.log('got');
        if (!req.xhr) return next();

        let name = req.body.name;
        // new
        res.json({
            error: null,
            data: 'ok'
        });
    });
}
