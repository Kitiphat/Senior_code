const pool = require('../config/db');

exports.listUser = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_data');
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};