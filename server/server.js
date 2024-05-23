const express = require('express');
const { readdirSync } = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT;  // Use PORT provided by Heroku or default to 3001

const pool = require('./config/db'); // Import the PostgreSQL connection

// Middleware to log requests to the console
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// Dynamically load routes
readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening at PORT:${PORT}`);
});
