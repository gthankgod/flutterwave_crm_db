const config = require('config');
const mysql = require('mysql2');

module.exports = () => {
    const db = mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database
    });
    
    db.connect(error => {
    
        if(error) {
            console.log(error)
        } else {
            console.log('Mysql Connected');
        }
    
    });
}

module.exports.dbCredentials = function dbCredentials () {

    const db = mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database
    });
};