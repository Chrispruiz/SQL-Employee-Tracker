const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

//Create connection to SQL
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Bentley0101',
    database: 'employeeTracker_db',
});

//Connects to SQL database
connection.connect(err => {
    if (err) throw err;
    beginPrompt();
});

// User prompts
function beginPrompt() {
        inquirer
            .prompt({
                name: 'action',
                type: 'list',
                message: 'Please select from the following options:',
                choices: [
                        'View all departments',
                        'View all roles',
                        'View all employees',
                        'Add a department',
                        'Add a role',
                        'Add an employee',
                        'Update an employee role',
                        'Delete a department',
                        'Delete an employee',
                        'EXIT'
                        ]
                }).then(function (answer) {
                    switch (answer.action) {
                        case 'View all departments':
                            viewDepartments();
                            break;
                        case 'View all roles':
                            viewRoles();
                            break;
                        case 'View all employees':
                            viewEmployees();
                            break;
                        case 'Add a department':
                            addDepartment();
                            break;
                        case 'Add a role':
                            addRole();
                            break;
                        case 'Add an employee':
                            addEmployee();
                            break;
                        case 'Update an employee role':
                            updateRole();
                            break;
                        case 'Delete a department':
                            deleteDepartment();
                        case 'Delete an employee':
                            deleteEmployee();
                            break;
                        case 'EXIT': 
                            exitApp();
                            break;
                        /* default:
                            break; */
                    }
            })
};

// view departments
function viewDepartments() {
    var query = 'SELECT * FROM department';
    connection.query(query, function(err, res) {
        if(err)throw err;
        console.table('All Departments:', res);
        beginPrompt();
    })
};

// view roles 
function viewRoles() {
    var query = 'SELECT * FROM role';
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table('All Roles:', res);
        beginPrompt();
    })
};

// view employees 
function viewEmployees() {
    connection.query("SELECT employee.role_id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, role.salary AS Salary, department.name AS Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      beginPrompt()
  })
}

// add a department 
function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'newDepartment', 
                type: 'input', 
                message: 'Name of the Department?'
            }
            ]).then(function (answer) {
                connection.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.newDepartment
                    });
                var query = 'SELECT * FROM department';
                connection.query(query, function(err, res) {
                if(err)throw err;
                console.log('New department has been successfully added!');
                console.table('All Departments:', res);
                beginPrompt();
                })
            })
};

// add a role to the database
function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
    
        inquirer 
        .prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "What new role would like to add?"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the new role?'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var deptArry = [];
                    for (let i = 0; i < res.length; i++) {
                    deptArry.push(res[i].name);
                    }
                    return deptArry;
                },
            }
        ]).then(function (answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    department_id = res[a].id;
                }
            }
    
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, res) {
                    if(err)throw err;
                    console.log('You have successfully added a new role!');
                    console.table('All Roles:', res);
                    beginPrompt();
                })
        })
    })
};

// add an employee to the database
function addEmployee() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "First name: ",
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "Last name: "
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "What is the employee's manager's ID? "
                },
                {
                    name: 'role', 
                    type: 'list',
                    choices: function() {
                    var roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                    },
                    message: "What is the role of the employee? "
                }
                ]).then(function (answer) {
                    let role_id;
                    for (let a = 0; a < res.length; a++) {
                        if (res[a].title == answer.role) {
                            role_id = res[a].id;
                            console.log(role_id)
                        }                  
                    }  
                    connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('Employee has been added!');
                        beginPrompt();
                    })
                })
        })
};

//Update Employee
function updateRole() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole()
          },
      ]).then(function(val) {
        var roleId = selectRole().indexOf(val.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: val.lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err
            console.table(val)
            beginPrompt()
        })
  
    });
  });

  };



 //Update employee roles

 //Id prompt for employee
  function promptId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employee's ID?:  "
        }
    ]);
};

//Update the role
async function updateRole() {
    const employeeId = await inquirer.prompt(promptId());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee SET role_id = ${roleId} WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role has been successfully updated!')
            beginPrompt();
        });
    });
};

//Delete a department
function deleteDepartment() {
    inquirer
      .prompt({
        name: "deleteDepartment",
        type: "input",
        message: "Please enter the ID of the department you would like to remove:",
  
      })
      .then(function (answer) {
        console.log(answer);
        var queryDept = "DELETE FROM department WHERE ?";
        var newDeptId = Number(answer.deleteDepartment);
        console.log(newDeptId);
        connection.query(queryDept, { id: newDeptId }, function (err, res) {
          beginPrompt();
        });
      });
  }

//Delete employee
function deleteEmployee() {
    inquirer
      .prompt({
        name: "deleteEmployee",
        type: "input",
        message: "Please enter the ID of the employee you would like to remove:",
  
      })
      .then(function (answer) {
        console.log(answer);
        var query = "DELETE FROM employee WHERE ?";
        var newId = Number(answer.deleteEmployee);
        console.log(newId);
        connection.query(query, { id: newId }, function (err, res) {
          beginPrompt();
        });
      });
  }



// exit function
function exitApp() {
    connection.end();
};