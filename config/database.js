var mysql = require('mysql2/promise');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: '192.168.1.127',
    user: 'root',
    password: 'root',
    database: 'joot-rarity-finder',
    port: 3306,
});

module.exports = {
    pool,
};
