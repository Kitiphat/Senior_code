const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const { fname,lname, tel_no,email,dob,address, gender ,username , password} = req.body;
    const fullname = fname + " " + lname;
    const genderParseInt = parseInt(gender);
    
    // Check if user already exists in
    const user = await pool.query('SELECT * FROM user_data WHERE username = $1 AND email = $2', [username, email]);
    
    if(user.rows[0]) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    else
    {
      // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO user_data ( fname,lname, tel_no,email,dob,address, gender ,username , password,name) VALUES ($1, $2, $3, $4 ,$5, $6 ,$7 ,$8 ,$9 ,$10) RETURNING *'
        , [fname,lname, tel_no,email,dob,address, genderParseInt ,username , hashedPassword, fullname]);

    
    res.json(result);
    }

  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query('SELECT * FROM user_data WHERE username = $1', [username]);
    if (!user.rows[0]) {
      return res.status(400).json({ error: 'User does not exist' });
    }
    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const payload = {
      user: {
        username: user.rows[0].username,
        userId: user.rows[0].user_id,
        name: user.rows[0].name

      }  
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

// export a middleware to validate requests for protected routes