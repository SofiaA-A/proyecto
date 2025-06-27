const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const multer = require('multer');

// Configuración multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ RUTAS EN ORDEN CORRECTO
router.get('/available', carController.getAvailableCars); // <-- esta primero

router.get('/user/:userId', carController.getCarByUserId);
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.post('/', upload.single('image'), carController.createCar);
router.put('/:id', upload.single('image'), carController.updateCar);
router.put('/:id/assign', carController.assignCarToUser);
router.delete('/:id', carController.deleteCar);

module.exports = router;
