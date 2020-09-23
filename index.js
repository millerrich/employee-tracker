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
            "update employee role",
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
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        type: "list",
        message: "Employee's manager:",
        name: "manager",
        choices: [
            1,
            2,
            3,
            4,
            5
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
        name: "salary"
    },
    {
        type: "list",
        message: "select department ID:",
        name: "department_id",
        choices: [
            1,
            2,
            3,
            4,
            5
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
        init();
      });
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, result) {
        if (err) throw err;
        console.table(result);
        init();
      });
}

function viewDepts() {
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        console.table(result);
        init();
      });
}

function addEmployee(answers) {
    
    const { firstName, lastName, role, manager } = answers;

    console.log("----------------------\n" + "Adding new employee...\n" + "----------------------\n");
    connection.query(
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
                choices: res.map(emp => ({
                    name: emp.first_name + " " + emp.last_name,
                    value: emp.id
                }))
            }
        ]).then(answer => {
            connection.query(
                "DELETE FROM employee WHERE ?",
                {
                    id: answer.remove
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("----------------------\nEmployee Removed\n----------------------\n")
                    init();
                }
            );
        })
    });
}

function addRole(answers) {

    const { title, salary, department_id } = answers;

    console.log("----------------------\n" + "Adding new role...\n" + "----------------------\n");
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: title,
        salary: salary,
        department_id: department_id
      },
      function(err, res) {
        if (err) throw err;
        console.log("----------------------\n" + res.affectedRows + " role inserted!\n");
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
            connection.query(
                "DELETE FROM role WHERE ?",
                {
                    title: answer.remove
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(answer.remove + " removed from roles")
                    init();
                }
            );
        })
    });
}

function updateRole() {
    
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        prompt([
            {
                type: "rawlist",
                message: "Which employee would you like to update the role for?",
                name: "updateSelect",
                choices: res.map(emp => ({
                    name: emp.first_name + " " + emp.last_name + " Current Role ID: " + emp.role_id,
                    value: emp.id
                }))
            },
            {
                type: "list",
                message: "Select employee's new role ID:",
                name: "roleUpdate",
                choices: [
                    1,
                    2,
                    3,
                    4,
                    5
                ]
            }
        ]).then(answers => {
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: answers.roleUpdate
                    },
                    {
                        id: answers.updateSelect
                    }
                ],
                function(err, res) {
                    if (err) throw err;
                    console.log("role updated")
                    init();
                }
            )
        });
    });
}

function addDepartment(answers) {

    const { name } = answers;

    console.log("----------------------\n" + "Adding new department...\n" + "----------------------\n");
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: name
      },
      function(err, res) {
        if (err) throw err;
        console.log("----------------------\n" + res.affectedRows + " department inserted!\n");
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
            connection.query(
                "DELETE FROM department WHERE ?",
                {
                    name: answer.remove
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(answer.remove + " removed from department")
                    init();
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
        case "update employee role":
            updateRole();
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