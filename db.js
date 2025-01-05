const { Pool } = require('pg');

// Configure the database connection
const pool = new Pool({
  user: 'app_user',          // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'watermeter_db', // Replace with your database name
  password: 'Ugreen25', // Replace with your PostgreSQL password
  port: 5432,                // Default PostgreSQL port
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database.');
});

module.exports = pool;
