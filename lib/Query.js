const mysql = require('mysql2');
const pwd = require('../config/keys');
const cTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: process.env.DB_PASS,
	// password : pwd,
	database: 'employee_tracker_db'
});

connection.connect((err) => {
	if (err) throw err;
	console.log('connected as id ' + connection.threadId + '\n');
});

class Query {
	deptHelper(deptName) {
		return connection.promise().query(
			`SELECT id FROM departments
       WHERE dept_name = ?`,
			deptName
		);
	}

	// used in addEmployee
	roleHelper(roleName) {
		return connection.promise().query(
			`SELECT id FROM roles
       WHERE title = ?`,
			roleName
		);
	}

	// used in addEmployees
	managerHelper(managerName) {
		return connection.promise().query(
			`SELECT id FROM employees
       WHERE first_name = ?`,
			managerName
		);
	}

	// MAIN METHODS
	viewDept() {
		return connection.promise().query('SELECT * FROM departments');
	}

	viewRoles() {
		return connection.promise().query(
			`SELECT r.id, title, salary, d.dept_name AS department
       FROM roles r
       JOIN departments d
        ON r.department_id = d.id`
		);
	}
	viewEmployees() {
		return connection.promise().query(
			`SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        title, 
        dept_name AS department,
        salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employees e
      LEFT JOIN employees m
        ON e.manager_id = m.id
      LEFT JOIN roles r 
        ON e.role_id = r.id
      LEFT JOIN departments d
        ON r.department_id = d.id`
		);
	}

	addDepartment(newDept) {
		return connection.promise().query(`INSERT INTO departments SET ?`, {
			dept_name: newDept
		});
	}

	// ISSUE...need to add department id to db, but user is passing in department name.   need to first query departments table to retrieve id associated with dept_name so i can pass an id to INSERT query that adds role (whose schema requires a department_id, NOT a name string)
	addRole(newRole) {
		const { title, salary, department } = newRole;
		let deptID;
		this.deptHelper(department)
			.then(([rows, fields]) => {
				deptID = rows[0].id;
				return rows[0].id;
				// return deptID;
			})
			.then((rowID) => {
				console.log('department id:', rowID);
			})
			.catch(console.log);

		return connection.promise().query(`INSERT INTO roles SET ?`, {
			title: title,
			salary: salary,
			// department_id: deptID
		});
	}
	addEmployee(newEmp) {
		const { firstName, lastName, role, manager } = newEmp;
		this.roleHelper(role)
			.then(([ rows, fields ]) => {
				return rows[0].id;
			})
			.then((rowID) => {
        // GETTING CORRECT VALUE FROM INITIAL QUERY
				console.log('role id:', rowID);
			});

      // HARD-CODE
      this.managerHelper('Kevin')
      // this.managerHelper(manager)
			.then(([ rows, fields ]) => {
				return rows[0].id;
			})
			.then((rowID) => {
        // GETTING CORRECT VALUE FROM INITIAL QUERY
				console.log('manager id:', rowID);
			})
			.catch(console.log);
		return connection.promise().query(`INSERT INTO employees SET ?`, {
			first_name : firstName,
      last_name  : lastName,
      // HARD-CODED 
			role_id    : 3,
			manager_id : 3
		});
	}
	updateEmpRole() {
		return connection.promise().query(``);
	}
	quit() {
		connection.end();
	}
}

// // DEV PURPOSES ONLY******************************************************
const testQuery = new Query();
// testQuery.viewDept()
// testQuery.viewRoles()
// testQuery.viewEmployees()
// testQuery.addDepartment('Marketing').then(testQuery.viewDept)
// testQuery.addRole({ title: 'testRole', salary: '6666666', department: 'Legal'})
testQuery
	.addRole({ title: 'testRole', salary: '6666666', department: 'Legal' })
	// .then(testQuery.viewRole)
	// // testQuery.addEmployee()
	// // testQuery.updateEmpRole()

	.then(([row, field]) => {
		console.table(row);
	})
	.catch(console.log)
	.then(() => testQuery.quit());

module.exports = Query;