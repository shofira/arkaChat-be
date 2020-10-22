const express = require('express')
const { destroy } = require('../controllers/message')

const router = express.Router()

router.delete('/delete/:id', destroy)

module.exports = router