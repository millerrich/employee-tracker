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

// const removeQuestions = [
//     {
//         type: "number",
//         message: "Enter ID number of employee to remove:",
//         name: "remove"
//     }
// ]

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, result) {
        if (err) throw err;
        console.table(result);
        connection.end();
      });
}

function addEmployee(answers) {
    
    const { firstName, lastName, role, manager } = answers;

    console.log("----------------------\n" + "Adding new employee...\n" + "----------------------\n");
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
        console.log("----------------------\n" + res.affectedRows + " employee inserted!\n");
        connection.end();
      }
    );

    console.log(query.sql);
}

function removeEmployee() {

    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        prompt([
            {
                type: "rawlist",
                message: "Which employee would you like to remove?",
                name: "remove",
                choices: res.map(employees => employees.first_name)
            }
        ]).then(answer => {
            console.log(answer.remove);
            connection.query(
                "DELETE FROM employee WHERE ?",
                {
                    first_name: answer.remove
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(answer.remove + " removed from employees")
                }
            );
        })
    });
}

function init() {
    prompt(questions).then(answers => {
        switch (answers.options) {
        case "view all employees":
            viewEmployees();
            break;
        case "add employee":
            prompt(employeeQuestions).then(answers => {
                return addEmployee(answers);
            });
            break;
        case "remove employee":
            removeEmployee();
            break;
        }
    });
};