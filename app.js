const inquirer = require('inquirer');
const cTable = require('console.table');

const promptActions = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'actions',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        }
    ])
}

const promptDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department you would like to add?'
        }
    ])
}

const promptRole = () => {
    const deptChoices = ['Sales', 'Engineering', 'Finance', 'Legal'];
    return inquirer.prompt([
        {
            type: 'input',
            name: 'role',
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
}

const promptAddEmp = () => {
    const roleChoices = ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Accountant', 'Legal Team Lead', 'Lawyer'];
    const managerChoices = ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Malia Brown', 'Sarah Lourd', 'Tom Allen'];
    return inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the new employee\'s first name?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee\'s last name?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select the employee\'s role',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select the employee\'s manager',
            choices: managerChoices
        }
    ])
}

const promptUpdateEmp = () => {
    const employeeChoices = ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Malia Brown', 'Sarah Lourd', 'Tom Allen'];
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Please select the employee to update',
            choices: employeeChoices
        },
        {
            type: 'input',
            name: 'role',
            message: 'Please enter the employee\'s new role?'
        }
    ])
}

promptAddEmp();