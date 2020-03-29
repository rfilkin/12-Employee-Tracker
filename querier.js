var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
const starter = require('./start.js');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "EmployeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  starter.main_menu();
});

class querier{
    constructor(){
        
    }
}