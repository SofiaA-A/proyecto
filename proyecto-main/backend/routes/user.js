// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Ruta para crear usuario
router.post('/register', userController.crearUsuario);
//editar
router.put('/:id', userController.editarUsuario);
//eliminar
router.delete('/:id', userController.eliminarUsuario);

module.exports = router;
