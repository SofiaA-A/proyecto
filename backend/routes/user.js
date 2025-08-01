const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const UploadsUsers = require('../middlewares/UploadsUsers');

router.post('/register', UploadsUsers.single('image'), userController.crearUsuario);

// Mostrar todos los usuarios
router.get('/', userController.getAll);

// Mostrar todos los usuarios sin paginación
router.get('/all', userController.getAllWithoutPagination);

// Mostrar usuario por ID
router.get('/:id', userController.getUserById);

// Editar usuario (con multer para imagen)
router.put('/:id', UploadsUsers.single('image'), userController.editarUsuario);


// Eliminar usuario
router.delete('/:id', userController.eliminarUsuario);

module.exports = router;
