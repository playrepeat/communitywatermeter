const pool = require('./db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected. Current time:', res.rows[0]);
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    pool.end();
  }
})();
