const express = require('express')
const { register, activate, login } = require('../controllers/user')

const router = express.Router()

router
  .post('/register', register)
  .get('/activate/:token', activate)
  .post('/login', login)

module.exports = router