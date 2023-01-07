const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
// Import and require mysql2
const mysql = require('mysql2');
//Protect SQL login info
require('dotenv').config();


// Using mysql2 this logs into the mySQL database
const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employeesDB'
  },
);

// Connect database
db.connect(err => {
  if (err) throw err;
  console.log(`Connected to the employeesDB database.`)
  startTracker();
});

//Function to prompt questions, answer questions, and add/view tables
const startTracker = function () {
  inquirer.prompt([{
    type: 'list',
    name: 'prompt',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update employee role',
      'Exit'
    ]
  }]).then((choice) => {
    if (choice.prompt === 'View all departments') {
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        console.table(result);
        startTracker();
      })
    } else if (choice.prompt === 'View all roles') {
      db.query(`SELECT * FROM role JOIN department ON role.department_id = department.id`, (err, result) => {
        if (err) throw err;
        console.table(result);
        startTracker();
      })
    } else if (choice.prompt === 'View all employees') {
      db.query(`SELECT * FROM employee JOIN role ON employee.role_id = role.id`, (err, result) => {
        if (err) throw err;
        console.table(result);
        startTracker();
      })
    } else if (choice.prompt === 'Add a department') {
      inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'Enter department name',
        //validating as department name NOT NULL
        validate: departmentEnter => {
          if (departmentEnter) {
            return true;
          } else {
            console.log('You must enter a department name');
            return false;
          }
        }
      }]).then((choice) => {
        db.query(`INSERT INTO department (name) VALUES(?)`, [choice.department], (err, result) => {
          if (err) throw err;
          console.log('Department added')
          startTracker()
        });
      })
    } else if (choice.prompt === 'Add a role') {
      //Pull in department table for department selection on role
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        inquirer.prompt([{
          type: 'input',
          name: 'role',
          message: 'Enter role title',
          //validating as title name NOT NULL
          validate: roleEnter => {
            if (roleEnter) {
              return true;
            } else {
              console.log('You must enter a role title');
              return false;
            }
          }
        }, {
          type: 'input',
          name: 'salary',
          message: 'Enter role salary',
          //validating as role salary NOT NULL
          validate: salaryEnter => {
            if (salaryEnter) {
              return true;
            } else {
              console.log('You must enter a role salary');
              return false;
            }
          }
        }, {
          type: 'list',
          name: 'department',
          message: 'Select department role falls under',
          choices: () => {
            let departmentArr = [];
            for (let i = 0; i < result.length; i++) {
              departmentArr.push(result[i].name);
            }
            return departmentArr;
          }
        }]).then((choice) => {
          for (let i = 0; i < result.length; i++) {
            if (result[i].name === choice.department) {
              department = result[i];
            }
          }
          db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [choice.role, choice.salary, department.id], (err, result) => {
            if (err) throw err;
            console.log('Role added')
            startTracker();
          });
        })
      });
    } else if (choice.prompt === 'Add an employee') {
      //Pull in role table for role selection on employee
      db.query(`Select * FROM role`, (err, result) => {
        if (err) throw err;
        inquirer.prompt([{
          type: 'input',
          name: 'firstName',
          message: 'Enter employee first name',
          //validating first name NOT NULL
          validate: firstNameEnter => {
            if (firstNameEnter) {
              return true;
            } else {
              console.log('You must enter first name');
              return false;
            }
          }
        }, {
          type: 'input',
          name: 'lastName',
          message: 'Enter employee last name',
          //validating last name NOT NULL
          validate: lastNameEnter => {
            if (lastNameEnter) {
              return true;
            } else {
              console.log('You must enter last name');
              return false;
            }
          }
        }, {
          type: 'input',
          name: 'manager',
          message: 'Enter employee manager leave blank if none',
        }, {
          type: 'list',
          name: 'role',
          message: 'Choose employee role',
          choices: () => {
            let roleArr = [];
            for (let i = 0; i < result.length; i++) {
              roleArr.push(result[i].title);
            }
            
            return roleArr;           
          }
        }
        ]).then((choice) => {
          for (let i = 0; i < result.length; i++) {
            if (result[i].title === choice.role) {
              role = result[i];
            }
          }
          db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [choice.firstName, choice.lastName, role.id, choice.manager.id], (err, result) => {
            if (err) throw err;
            console.log('Added employee')
            startTracker()
          })
        })
    });
}
  })
}
