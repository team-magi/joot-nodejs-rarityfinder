var mysql = require('mysql2');

var mysqlConf = {
    adapter: 'mysql',
    host: process.env.OPENSHIFT_MYSQL_DB_HOST || '192.168.1.22',
    port: process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
    user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'alex',
    password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'aliuchuang',
    database: process.env.OPENSHIFT_APP_NAME || 'joot-rarity-finder',
    prefix: ''
};

var pool = mysql.createPool({
    connectionLimit: 10,
    host: mysqlConf.host,
    user: mysqlConf.user,
    password: mysqlConf.password,
    database: mysqlConf.database,
    port: mysqlConf.port,
});

module.exports = {
    connections: {
        default: pool.promise()
    }
};
