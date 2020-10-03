require("dotenv").config()

module.exports = {
  PORT: process.env.PORT,
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASS: process.env.DB_PASS,
  DB: process.env.DATABASE
}