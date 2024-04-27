const express = require('express');
const { readdirSync } = require('fs')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors');
const app = express();
const port = 3001;
const pool = require('./config/db'); // Import the PostgreSQL connection
const dotenv = require('dotenv');
const axios = require('axios'); 
dotenv.config();
// Middleware to log requests to the console


app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json())


readdirSync('./routes')
.map((r)=> app.use('/api', require('./routes/'+r)))



app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

