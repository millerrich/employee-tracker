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
        type: "number",
        message: "Enter ID number of employee to remove:",
        name: "remove"
    }
]

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

function removeEmployee(answers) {

    const empID = answers.remove;
    
    console.log("Removing employee...\n");
    connection.query(
    "DELETE FROM employee WHERE ?",
    {
      id: empID
    },
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " was removed!\n");
    });
    connection.end();
}

function init() {
    prompt(questions).then(answers => {
        if (answers.options === "view all employees") {
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
            connection.query("SELECT * FROM employee", async function (err, result) {
                if (err) throw err;
                await console.table(result);
            });
            
            // add function to create object of first name and id from employee table
            // push to var employees to have as choices in remove question
            prompt(removeQuestions). then(answers => {
                return removeEmployee(answers);
            })
        }
});
};