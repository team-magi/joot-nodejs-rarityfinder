var express = require('express')
var router = express.Router()

var { connections } = require('../../config/database');

// define the home page route
router.get('/', function (req, res) {
    res.send('hello world');
});

module.exports = router;
