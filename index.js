const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
//Protect SQL login info
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Using mysql2 this logs into the mySQL database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: '',
    password: '',
    database: 'employeesDB'
  },
  console.log(`Connected to the employeesDB database.`)
);