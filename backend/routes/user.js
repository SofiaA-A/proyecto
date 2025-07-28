// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const UploadsUsers = require('../middlewares/UploadsUsers');
router.post('/register', UploadsUsers.single('image'), userController.crearUsuario);

//mostar todos los usuarios
router.get('/', userController.getAll);
//muestra toso los usuarios sin un vehiculo
router.get('/all', userController.getAllWithoutPagination);

 //mostar usuario por el id
router.get('/:id',userController.getUserById)
// Ruta para crear usuario
router.post('/register', userController.crearUsuario);
//editar
router.put('/:id', userController.editarUsuario);
//eliminar
router.delete('/:id', userController.eliminarUsuario);

module.exports = router;
