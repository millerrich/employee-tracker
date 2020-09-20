var { prompt } = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
});

connection.connect();

const questions = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "options",
        choices: [
            "view all employees",
            "add employee",
            "remove employee",
            "view employees by department",
            "view employees by role"
        ]
    }
]