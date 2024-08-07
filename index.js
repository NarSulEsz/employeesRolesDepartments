// Import required modules
const inquirer = require('inquirer');
const { Pool } = require('pg');

// New instance of Pool object. Connecting the js with database
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'staff', 
    password: 'Tu154', 
    port: 5432,
  });

  // Main  function proposing user to choose
async function mainMenu() {
    // Array of choices for the main menu
    const choices = [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update Employee Role',
      'Exit'
    ];
  
    // Propose the user to make chose of action
    const { action } = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices
    });
  
    // Switches of  statements and showing different tables
    switch (action) {
      case 'View All Departments':
        return viewAllDepartments();
      case 'View All Roles':
        return viewAllRoles();
      case 'View All Employees':
        return viewAllEmployees();
      case 'Add a Department':
        return addDepartment();
      case 'Add a Role':
        return addRole();
      case 'Add an Employee':
        return addEmployee();
      case 'Update Employee Role':
        return updateEmployeeRole();
      case 'Exit':
        pool.end();
        process.exit();
    }
  }



  // Starting of the application via calling the main function
mainMenu();