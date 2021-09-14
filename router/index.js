var express = require('express')
var router = express.Router()

var { pool } = require('../config/database');

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
    let sql = `SELECT * from loot where tokenId = "${tokenId}" LIMIT 1`;
    let [rows] = await pool.query(sql);
    let info = rows[0];
    sql = `SELECT * from loot_owner where tokenId = "${tokenId}" LIMIT 1`;
    [rows] = await pool.query(sql);
    info.claimed_by = rows.length > 0 ? rows[0].claimed_by : '';
    info.claim_time = rows.length > 0 ? rows[0].claim_time : '';
    if (rows.length > 0) {
        res.json({
            code: 200,
            data: info,
        });
    } else {
        res.json({
            code: 200,
            data: [],
        });
    }
});

module.exports = router;
