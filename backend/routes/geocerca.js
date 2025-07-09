const express = require('express');
const router = express.Router();
const geocercaController = require('../controllers/geocercaController');

router.post('/geocercas', geocercaController.create);       // Crear
router.get('/geocercas', geocercaController.getAll);        // Listar todas
router.get('/geocercas/:id', geocercaController.getById);   // Obtener por ID
router.put('/geocercas/:id', geocercaController.update);    // Actualizar
router.delete('/geocercas/:id', geocercaController.delete); // Eliminar

module.exports = router;
