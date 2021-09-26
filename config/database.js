var mysql = require('mysql2/promise');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: '34.122.236.191',
    user: 'joot',
    password: 'fP4DaD6Z7LD7iCGR',
    database: 'joot',
    port: 3306,
});

module.exports = {
    pool,
};
