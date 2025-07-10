const { noTrueLogging } = require('sequelize/lib/utils/deprecations');
const { Geocerca, Car, User } = require('../models');

const geocercaController = {
  // Crear geocerca
  async create(req, res) {
    try {
      const { lat, lng, radius, car_id, user_id } = req.body;

      // Validar si el carro existe
      const car = await Car.findByPk(car_id);
      if (!car) return res.status(404).json({ message: 'Car not found' });

      // Validar si el usuario existe
      const user = await User.findByPk(user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Crear la geocerca
      const nuevaGeocerca = await Geocerca.create({
        center: { type: 'Point', coordinates: [lat, lng] },
        radius,
        car_id,
        user_id
      });

      res.status(201).json(nuevaGeocerca);
    } catch (error) {
      console.error('Error al crear geocerca:', error);
      res.status(500).json({ message: 'Error al crear geocerca' });
    }
  },

  // Obtener todas las geocercas
  async getAll(req, res) {
    try {
      const geocercas = await Geocerca.findAll({
        include: [
          { model: Car, as: 'car' },
          { model: User, as: 'user' }
        ]
      });
      res.json(geocercas);
    } catch (error) {
      console.error('Error al obtener geocercas:', error);
      res.status(500).json({ message: 'Error al obtener geocercas' });
    }
  },

  async getByCarId(req, res) {
    try {
      const carId = req.params.car_id;

      const geocerca = await Geocerca.findOne({ where: { car_id: carId } });

      if (!geocerca) {
        return res.status(404).json({ message: "No se encontró geocerca para este carro" });
      }

      res.json(geocerca);
    } catch (error) {
      console.error("Error al obtener geocerca por car_id:", error);
      res.status(500).json({ error: "Error al obtener geocerca" });
    }
  },
  // Obtener una geocerca por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const geocerca = await Geocerca.findByPk(id, {
        include: [
          { model: Car, as: 'car' },
          { model: User, as: 'user' }
        ]
      });
      if (!geocerca) return res.status(404).json({ message: 'Geocerca no encontrada' });
      res.json(geocerca);
    } catch (error) {
      console.error('Error al obtener geocerca:', error);
      res.status(500).json({ message: 'Error al obtener geocerca' });
    }
  },

  // Actualizar geocerca
  async update(req, res) {
    try {
      const { id } = req.params;
      const { lat, lng, radius } = req.body;

      const geocerca = await Geocerca.findByPk(id);
      if (!geocerca) return res.status(404).json({ message: 'Geocerca no encontrada' });

      geocerca.center = { type: 'Point', coordinates: [lat, lng] };
      geocerca.radius = radius;
      await geocerca.save();

      res.json(geocerca);
    } catch (error) {
      console.error('Error al actualizar geocerca:', error);
      res.status(500).json({ message: 'Error al actualizar geocerca' });
    }
  },

  // Eliminar geocerca
  async delete(req, res) {
    try {
      const { id } = req.params;
      const geocerca = await Geocerca.findByPk(id);
      if (!geocerca) return res.status(404).json({ message: 'Geocerca no encontrada' });

      await geocerca.destroy();
      res.json({ message: 'Geocerca eliminada' });
    } catch (error) {
      console.error('Error al eliminar geocerca:', error);
      res.status(500).json({ message: 'Error al eliminar geocerca' });
    }
  }
};

module.exports = geocercaController;
