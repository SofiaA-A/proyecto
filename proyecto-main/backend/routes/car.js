// routes/carRoutes.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Ruta para obtener todos los autos
router.get('/', carController.getAllCars);

// Ruta para crear un auto
router.post('/', carController.createCar);

// Ruta para actualizar un auto
router.put('/:id', carController.updateCar);

// Ruta para eliminar un auto
router.delete('/:id', carController.deleteCar);

module.exports = router;
