const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const db = new Pool({
  user: process.env.PGUSER,
  database: process.env.DB,
  password: process.env.PGPASS,
  port: process.env.PGPORT,
  host: process.env.PGHOST
});

db.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT * FROM questions where question_id = 1', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log(result.rows);
  });
});

module.exports = db;

// const dotenv = require("dotenv").config();
// const { Client } = require('pg')
// const client = new Client({
//   user: process.env.PGUSER,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASS,
//   host: process.env.PGHOST
// });

// client.connect()
//   .then(() => {console.log('database connected')})
//   .catch(err => {console.log(err)})

//   module.exports = client
