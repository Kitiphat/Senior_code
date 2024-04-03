const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.dbname,
  password: process.env.password,
  port: process.env.port || 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err);
  }
  console.log('Connected to PostgreSQL database');
  release(); // Release the client back to the pool
});

module.exports = pool;
