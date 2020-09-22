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
            "view all roles",
            "view all departments",
            "add employee",
            "remove employee",
            "add a role",
            "remove a role",
            "add a department",
            "remove a department",
            "EXIT"
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

const roleQuestions = [
    {
        type: "input",
        message: "Please enter title of role:",
        name: "title"
    },
    {
        type: "number",
        message: "Salary:",
        name: "salary",
        // validate isNaN
    },
    {
        type: "list",
        message: "select department ID:",
        name: "department_id",
        choices: [
            1,
            2,
            3
        ]
    },
]

const departmentQuestions = [
    {
        type: "input",
        message: "Enter department title:",
        name: "name"
    }
]

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, result) {
        if (err) throw err;
        console.table(result);
        // connection.end();
        init();
      });
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, result) {
        if (err) throw err;
        console.table(result);
        // connection.end();
        init();
      });
}

function viewDepts() {
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        console.table(result);
        // connection.end();
        init();
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
        // connection.end();
        init();
      }
    );
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

function addRole(answers) {

    const { title, salary, department_id } = answers;

    console.log("----------------------\n" + "Adding new role...\n" + "----------------------\n");
    var query = connection.query(
      "INSERT INTO role SET ?",
      {
        title: title,
        salary: salary,
        department_id: department_id
      },
      function(err, res) {
        if (err) throw err;
        console.log("----------------------\n" + res.affectedRows + " role inserted!\n");
        // connection.end();
        init();
      }
    );
}

function removeRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        prompt([
            {
                type: "rawlist",
                message: "Which role would you like to remove?",
                name: "remove",
                choices: res.map(roles => roles.title)
            }
        ]).then(answer => {
            // console.log(answer.remove);
            connection.query(
                "DELETE FROM role WHERE ?",
                {
                    title: answer.remove
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(answer.remove + " removed from roles")
                }
            );
            init();
        })
    });
}

function addDepartment(answers) {

    const { name } = answers;

    console.log("----------------------\n" + "Adding new department...\n" + "----------------------\n");
    var query = connection.query(
      "INSERT INTO department SET ?",
      {
        name: name
      },
      function(err, res) {
        if (err) throw err;
        console.log("----------------------\n" + res.affectedRows + " department inserted!\n");
        // connection.end();
        init();
      }
    );
}

function removeDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        prompt([
            {
                type: "rawlist",
                message: "Which department would you like to remove?",
                name: "remove",
                choices: res.map(dep => dep.name)
            }
        ]).then(answer => {
            // console.log(answer.remove);
            connection.query(
                "DELETE FROM department WHERE ?",
                {
                    name: answer.remove
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(answer.remove + " removed from department")
                }
            );
            init();
        })
    });
}

function init() {
    prompt(questions).then(answers => {
        switch (answers.options) {
        case "view all employees":
            viewEmployees();
            break;
        case "view all roles":
            viewRoles();
            break;
        case "view all departments":
            viewDepts();
            break;
        case "add employee":
            prompt(employeeQuestions).then(answers => {
                return addEmployee(answers);
            });
            break;
        case "remove employee":
            removeEmployee();
            break;
        case "add a role":
            prompt(roleQuestions).then(answers => {
                return addRole(answers);
            });
            break;
        case "remove a role":
            removeRole();
            break;
        case "add a department":
            prompt(departmentQuestions).then(answers => {
                return addDepartment(answers);
            });
            break;
        case "remove a department":
            removeDepartment();
            break;
        case "EXIT":
            connection.end();
            break;
        }
    });
};