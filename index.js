var { prompt } = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    init();
})

const questions = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "options",
        choices: [
            "view all employees",
            "add employee",
            "remove employee"
            // "view employees by department",
            // "view employees by role"
        ]
    }
]

const employeeQuestions = [
    {
        type: "input",
        message: "Enter first name:",
        name: "firstName"
    },
    {
        type: "input",
        message: "Enter last name:",
        name: "lastName"
    },
    {
        type: "list",
        message: "Employee's role:",
        name: "role",
        choices: [
            // insert list of roles
            1,
            2,
            3
        ]
    },
    {
        type: "list",
        message: "Employee's manager:",
        name: "manager",
        choices: [
            // insert choices from those with role of manager
            1,
            2,
            3
        ]
    }
]

const removeQuestions = [
    {
        type: "list",
        message: "Which employee would you like to remove?",
        name: "remove",
        choices: [
            //insert choices from employee table
        ]
    }
]

function addEmployee(answers) {
    
    const { firstName, lastName, role, manager } = answers;

    console.log("Adding new employee...\n");
    var query = connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: firstName,
        last_name: lastName,
        role_id: role,
        manager_id: manager
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " employee inserted!\n");
        // Call updateProduct AFTER the INSERT completes
        // updateProduct();
      }
    );

    console.log(query.sql);
}

function init() {
    prompt(questions).then(answers => {
        if (answers.options === "view all employees") {
            // this isn't right, figure out how to get table
            connection.query("SELECT * FROM employee", function (err, result) {
                if (err) throw err;
                console.table(result);
                connection.end();
              });
        } else if (answers.options === "add employee") {
            prompt(employeeQuestions).then(answers => {
                return addEmployee(answers);
            })
        } else if (answers.options === "remove employee") {
            prompt(removeQuestions);
        }
});
};