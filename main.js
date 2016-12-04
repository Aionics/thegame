const express = require('express');
const app = express();

require('./api')(app);
require('./socket')(express);

app.set('json spaces', 40);
app.use('/', express.static('./public'));
app.use('/admin', express.static('./admin'));

app.get('/admin', function (req, res, next) {
	res.sendFile('admin.html', {root: __dirname + '/admin'} )
})

app.get('/*', function (req, res, next) {
    res.sendFile("index.html", { root: __dirname + "/public"} )
});

app.listen(47995, function () {
    console.log('listening on 3000');
});
