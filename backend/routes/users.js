// routes/users.js
const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')

router.post('/', userController.crearUsuario)

module.exports = router
