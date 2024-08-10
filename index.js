// Import required modules
const inquirer = require('inquirer');
const { Pool } = require('pg');

// New instance of Pool object. Connecting the js with database
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'staff', 
    password: ' ', 
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
  
    // Switches among  statements then showing different tables
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

  // Function to view all departments
async function viewAllDepartments() {
    try {
      const res = await pool.query('SELECT * FROM department');
      console.log('\nDepartments:\n');
      res.rows.forEach(department => {
        console.log(`ID: ${department.id}, Name: ${department.name}`);
      });
    } catch (err) {
      console.error(err);
    } finally {
      mainMenu();
    }
  }
  
  // Function to view all roles
  async function viewAllRoles() {
    try {
      const res = await pool.query('SELECT * FROM role');
      console.log('\nRoles:\n');
      res.rows.forEach(role => {
        console.log(`ID: ${role.id}, Title: ${role.title}, Salary: ${role.salary}, Department ID: ${role.department_id}`);
      });
    } catch (err) {
      console.error(err);
    } finally {
      mainMenu();
    }
  }
  
  // Function to view all employees
  async function viewAllEmployees() {
    try {
      const res = await pool.query('SELECT * FROM employee');
      console.log('\nEmployees:\n');
      res.rows.forEach(employee => {
        console.log(`ID: ${employee.id}, First Name: ${employee.first_name}, Last Name: ${employee.last_name}, Role ID: ${employee.role_id}, Manager ID: ${employee.manager_id}`);
      });
    } catch (err) {
      console.error(err);
    } finally {
      mainMenu();
    }
  }
  
  // Function to add a department
  async function addDepartment() {
    try {
      const { name } = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
      });
      await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
      console.log(`Added ${name} to the database.`);
    } catch (err) {
      console.error(err);
    } finally {
      mainMenu();
    }
  }
  
  // Function to add a role
  async function addRole() {
    try {
      const departments = await pool.query('SELECT * FROM department');
      const departmentChoices = departments.rows.map(dep => ({ name: dep.name, value: dep.id }));
  
      const { title, salary, department_id } = await inquirer.prompt([
        { name: 'title', type: 'input', message: 'Enter the title of the role:' },
        { name: 'salary', type: 'input', message: 'Enter the salary for the role:' },
        { name: 'department_id', type: 'list', message: 'Select the department for the role:', choices: departmentChoices }
      ]);
  
      await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
      console.log(`Added ${title} to the database.`);
    } catch (err) {
      console.error(err);
    } finally {
      mainMenu();
    }
  }
  
  // Function to add an employee
  async function addEmployee() {
    try {
      const roles = await pool.query('SELECT * FROM role');
      const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));
  
      const employees = await pool.query('SELECT * FROM employee');
      const managerChoices = employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
      managerChoices.push({ name: 'None', value: null });
  
      const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { name: 'first_name', type: 'input', message: 'Enter the first name of the employee:' },
        { name: 'last_name', type: 'input', message: 'Enter the last name of the employee:' },
        { name: 'role_id', type: 'list', message: 'Select the role of the employee:', choices: roleChoices },
        { name: 'manager_id', type: 'list', message: 'Select the manager of the employee:', choices: managerChoices }
      ]);
  
      await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
      console.log(`Added ${first_name} ${last_name} to the database.`);
    } catch (err) {
      console.error(err);
    } finally {
      mainMenu();
    }
  }
  
  // Function to update an employee role
  async function updateEmployeeRole() {
    try {
      const employees = await pool.query('SELECT * FROM employee');
      const employeeChoices = employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
  
      const roles = await pool.query('SELECT * FROM role');
      const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));
  
      const { employee_id, role_id } = await inquirer.prompt([
        { name: 'employee_id', type: 'list', message: 'Select the employee to update:', choices: employeeChoices },
        { name: 'role_id', type: 'list', message: 'Select the new role for the employee:', choices: roleChoices }
      ]);
  
      await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
      console.log('Updated employee role.');
    } catch (err) {
      console.error(err);
    } finally {
      mainMenu();
    }
  }


  // Starting of the application via calling the main function
mainMenu();