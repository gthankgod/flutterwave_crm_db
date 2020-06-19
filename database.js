const mysql = require('mysql2');
const config = require('config');



const dbConnection = mysql.createPool({
    host : config.get('host'),
    username : config.get('username'),
    password : config.get('dbPassword'),
    database : config.get('database')
}).promise();




module.exports = dbConnection;