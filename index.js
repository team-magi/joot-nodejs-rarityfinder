var express = require('express');

// middlewares
var forcehttps = require('./middlewares/forcehttps');
var cors = require('./middlewares/cors');
var routerIndex = require('./router');

// init server
var app = express();

app.use(cors);

app.use('/v1', routerIndex);

app.enable('trust proxy 1');

if (false) {
    app.use(forcehttps);
}

app.listen(3333);
