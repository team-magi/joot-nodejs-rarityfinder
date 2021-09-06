var express = require('express')
var router = express.Router()

var { connections } = require('../config/database');

router.get('/', function (req, res) {
    res.send('hello world');
});

router.get('/getContractList', async function (req, res) {
    res.json({
        code: 200,
        data: [{
            name: 'Loot',
            address: '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7',
        }],
    });
});

router.get('/getInfo', async function(req, res) {
    let tokenId = req.query.tokenId;
    let sql = `SELECT * from loot where tokenId = "${tokenId}"`;
    let [rows] = await connections.default.query(sql);
    if (rows.length > 0) {
        res.json({
            code: 200,
            data: rows[0],
        });
    } else {
        res.json({
            code: 200,
            data: [],
        });
    }
});

module.exports = router;
