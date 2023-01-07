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
    }


  })

}