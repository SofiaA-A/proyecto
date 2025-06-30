const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.get('/', routeController.getAll);

// Ruta para obtener rutas por userId (debe ir antes de la de :id)
router.get('/user/:userId', routeController.getRoutesByCarId);
router.get('/car/:carId', routeController.getRoutesByCarId);


router.get('/:id', routeController.getById);

// Rutas para crear, actualizar y eliminar
router.post('/', routeController.create);
router.put('/:id', routeController.update);
router.delete('/:id', routeController.delete);

module.exports = router;
