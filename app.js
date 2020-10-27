const inquirer = require('inquirer');
const cTable = require('console.table');
const Query = require('./lib/Query');
// const config = require('./package.json');

const query = new Query();

const promptActions = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Quit'
                ]
            }
        ])
        .then(({ action }) => {
            switch (action) {
                case 'View all departments':
                    console.log('');
                    query
                        .viewDept()
                        .then(([row]) => {
                            console.table(row);
                            promptActions();
                        })
                        .catch(console.log);
                    break;

                case 'View all roles':
                    console.log('');
                    query
                        .viewRoles()
                        .then(([row]) => {
                            console.table(row);
                            promptActions();
                        })
                        .catch(console.log);
                    break;

                case 'View all employees':
                    console.log('');
                    query
                        .viewEmployees()
                        .then(([row]) => {
                            console.table(row);
                            promptActions();
                        })
                        .catch(console.log);
                    break;

                case 'Add a department':
                    console.log('');
                    promptAddDepartment();
                    break;

                case 'Add a role':
                    console.log('');
                    promptAddRole();
                    break;

                case 'Add an employee':
                    console.log('');
                    promptAddEmployee();
                    break;

                case 'Update an employee role':
                    console.log('');
                    promptUpdateEmp();
                    break;

                case 'Quit':
                    console.log('')
                    console.log(logo({ name: 'Goodbye!', logoColor: 'cyan', borderColor: 'yellow' }).render());
                    query.quit();
                    break;
                default:
                    break;
            }
        });
};

const promptAddDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department you would like to add?'
            }
        ])
        .then(({ department }) => {
            query
                .addDepartment(department)

                .then(() => {
                    console.log(logo({ name: '\nNew department added!\n', logoColor: 'bold-green', borderColor: 'bold-green' }).render());
                    promptActions();
                })
                .catch(console.log);
        });
};

const promptAddRole = () => {
    query.deptsArray().then((deptChoices) => {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of the role you would like to add?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for this role?'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Please select the department this role belongs to',
                    choices: deptChoices
                }
            ])
            .then((roleObj) => {
                query
                    .addRole(roleObj)
                    .then(() => {
                        console.log(logo({ name: '\nNew role added!\n', logoColor: 'bold-green', borderColor: 'bold-green' }).render());
                        promptActions();
                    })
                    .catch(console.log);
            });
    });
};

const promptAddEmployee = () => {
    query.rolesArray().then((roleChoices) => {
        query.employeesArray().then((employeeChoices) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "What is the new employee's first name?"
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "What is the employee's last name?"
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "Select the employee's role",
                        choices: roleChoices
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Select the employee's manager",
                        choices: employeeChoices
                    }
                ])
                .then((addEmpObj) => {
                    query
                        .addEmployee(addEmpObj)
                        .then(() => {
                            console.log(logo({ name: '\nNew employee added!\n', logoColor: 'bold-green', borderColor: 'bold-green' }).render());
                            promptActions();
                        })
                        .catch(console.log);
                });
        });
    });
};

const promptUpdateEmp = () => {
    query.employeesArray().then((employeeChoices) => {
        query.rolesArray().then((roleChoices) => {
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Please select the employee to update',
                        choices: employeeChoices
                    },
                    {
                        type: 'list',
                        name: 'newRole',
                        message: "Please select the employee's new role",
                        choices: roleChoices
                    }
                ])
                .then((updateRoleObj) => {
                    query
                        .updateEmployeeRole(updateRoleObj)
                        .then(() => {
                            console.log(logo({ name: '\nEmployee role updated!\n', logoColor: 'bold-green', borderColor: 'bold-green' }).render());
                            promptActions();
                        })
                        .catch(console.log);
                });
        });
    });
};

console.log(logo({ name: 'Welcome to Employee Database!', logoColor: 'cyan', borderColor: 'yellow' }).render());
promptActions();