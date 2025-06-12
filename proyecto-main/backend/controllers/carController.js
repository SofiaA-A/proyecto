// controllers/carController.js
const { Car } = require('../models');

const carController = {
  getAllCars: async (req, res) => {
    try {
      const cars = await Car.findAll();
      res.json(cars);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener autos' });
    }
  },

  createCar: async (req, res) => {
    try {
      console.log('Datos recibidos:', req.body);
      const car = await Car.create(req.body);
      res.status(201).json(car);
    } catch (err) {
       console.error('Error al crear auto:', err);
      res.status(500).json({ message: 'Error al crear auto' });
    }
  },

  updateCar: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Car.update(req.body, { where: { id } });
      res.json({ message: 'Auto actualizado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar auto' });
    }
  },

  deleteCar: async (req, res) => {
    try {
      const { id } = req.params;
      await Car.destroy({ where: { id } });
      res.json({ message: 'Auto eliminado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar auto' });
    }
  },
};

module.exports = carController;
