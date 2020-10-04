const mysql = require('mysql2')
const { HOST, USER, PASS, DB } = require('../helper/env')

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASS,
  database: DB,
  dateStrings: 'date'
})

// check connection
connection.connect((err) => {
  if (err) {
    console.log('Not Connected!', err.message)
  } else {
    console.log('Connected')
  }
})

module.exports = connection