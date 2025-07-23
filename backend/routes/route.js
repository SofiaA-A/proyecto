const express = require('express');
const router = express.Router();
const routeController = require('../controllers/RouteController');

//muestra todas las ruta que hay
router.get('/', routeController.getAll);

// Ruta para obtener rutas por userId (debe ir antes de la de :id)
router.get('/user/:userId', routeController.getRoutesByCarId);
router.get('/car/:carId', routeController.getRoutesByCarId);


router.get('/:id', routeController.getById);

// Rutas para crear, actualizar y eliminar
router.post('/', routeController.create);
//editar
router.put('/:id', routeController.update);
//eliminar
router.delete('/:id', routeController.delete);

module.exports = router;
