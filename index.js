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