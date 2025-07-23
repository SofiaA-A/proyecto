const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const multer = require('multer')
const path = require('path')

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images_Users') // Carpeta donde guardar las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname)) // nombre único con extensión
  }
})
const upload = multer({ storage })

// Mostrar todos los usuarios
router.get('/', userController.getAll)

// Mostrar usuario por ID
router.get('/:id', userController.getUserById)

// Crear usuario (con imagen)
router.post('/register', upload.single('image'), userController.crearUsuario)

// Editar usuario (con imagen)
router.put('/:id', upload.single('image'), userController.editarUsuario)

// Eliminar usuario
router.delete('/:id', userController.eliminarUsuario)

module.exports = router
