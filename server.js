const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

//Create connection to SQL
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'Bentley0101',
    database: 'employeeTracker_db',
});

//Connects to SQL database
connection.connect(err => {
    if (err) throw err;
    prompt();
});

function prompt() {
    
}