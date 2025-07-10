const express = require('express');
const router = express.Router();
const geocercaController = require('../controllers/geocercaController');

//crear
router.post('/', geocercaController.create);   
//mostrar    
router.get('/', geocercaController.getAll);  

router.get('/car/:car_id', geocercaController.getByCarId);
//mostras por id
router.get('/:id', geocercaController.getById);   
//editar
router.put('/:id', geocercaController.update);    
//eliminar
router.delete('/:id', geocercaController.delete); 

module.exports = router;
