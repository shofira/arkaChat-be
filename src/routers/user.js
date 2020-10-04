const express = require('express')
const { register, activate, login, renewToken, logout } = require('../controllers/user')
const { authenticate, authorize } = require('../helper/auth')

const router = express.Router()

router
  .post('/register', register)
  .get('/activate/:token', activate)
  .post('/login', login)
  .post("/refresh", renewToken)
  .post('/logout/:id', authenticate, authorize, logout)

module.exports = router