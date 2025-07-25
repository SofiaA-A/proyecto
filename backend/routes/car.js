const express = require('express');
const router = express.Router();
const carController = require('../controllers/CarController');
const multer = require('multer');

// Configuración multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// RUTAS
router.get('/available', carController.getAvailableCars); // Autos no asignados
router.get('/user/:userId', carController.getCarByUserId); // Auto por usuario
router.get('/', carController.getAllCars); // Lista paginada de autos
router.get('/:id', carController.getCarById); // Auto por id
router.post('/', upload.single('image'), carController.createCar); // Crear auto con imagen
router.put('/:id', upload.single('image'), carController.updateCar); // Actualizar auto con imagen
router.put('/:id/assign', carController.assignCarToUser); // Asignar auto a usuario
router.delete('/:id', carController.deleteCar); // Eliminar auto

module.exports = router;
