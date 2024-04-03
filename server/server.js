const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const pool = require('./config/db'); // Import the PostgreSQL connection

app.use(cors());

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_data');
    console.log(`Server is connecting to db`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
