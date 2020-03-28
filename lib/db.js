var mysql = require('mysql');

var db =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '170818',
  database: 'opentutorials'
})
  

module.exports = db;