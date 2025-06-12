const express = require('express')
const router = express.Router()
const { login, register } = require('../controllers/authController')

// Ruta POST para login
router.post('/login', login)


module.exports = router
