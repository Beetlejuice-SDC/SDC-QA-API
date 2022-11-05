const express = require('express');
const dotenv = require("dotenv").config();
const db = require('./database/postgres.js');

//Middleware
var morgan = require('morgan');

const port = process.env.PORT;

// Router
var router = require('./routes.js');

const app = express();
module.exports.app = app;



//Logging and parsing
app.use(morgan('dev'));
app.use(express.json());

// Set up routes
app.use('/qa', router);



app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});