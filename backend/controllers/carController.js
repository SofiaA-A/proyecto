const { Car, User } = require('../models');

const carController = {
  // Obtener todos los autos con su propietario
  getAllCars: async (req, res) => {
    try {
      const cars = await Car.findAll({
        include: {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      });
      res.json(cars);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener autos', error: err.message });
    }
  },

  // Obtener auto por ID (usado en editar)
  getCarById: async (req, res) => {
    try {
      const { id } = req.params;
      const car = await Car.findByPk(id, {
        include: {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      });

      if (!car) {
        return res.status(404).json({ message: 'Auto no encontrado' });
      }

      res.json(car);
    } catch (err) {
      console.error('Error al obtener auto por ID:', err);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Crear un nuevo auto
  createCar: async (req, res) => {
    try {
      const { brand, model, plate,year, user_id } = req.body;

      if (!brand || !model || !plate || !year) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const car = await Car.create({
        brand,
        model,
        plate,
        year,
        user_id,
        image: imagePath
      });

      res.status(201).json(car);
    } catch (err) {
      console.error('Error al crear auto:', err);

      // Validación de placa duplicada
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'La placa ya está registrada' });
      }

      res.status(500).json({ message: 'Error al crear auto' });
    }
  },

  // Actualizar un auto existente
  updateCar: async (req, res) => {
    try {
      const { id } = req.params;
      const { brand, model, plate, year, user_id } = req.body;

      const car = await Car.findByPk(id);
      if (!car) {
        return res.status(404).json({ message: 'Auto no encontrado' });
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : car.image;

      await car.update({
        brand,
        model,
        plate,
        year,
        user_id,
        image: imagePath
      });

      res.json({ message: 'Auto actualizado' });
    } catch (err) {
      console.error('Error al actualizar auto:', err);

      // Validación de placa duplicada también para actualización
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'La placa ya está registrada' });
      }

      res.status(500).json({ message: 'Error al actualizar auto' });
    }
  },

  // Eliminar un auto
  deleteCar: async (req, res) => {
    try {
      const { id } = req.params;
      await Car.destroy({ where: { id } });
      res.json({ message: 'Auto eliminado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar auto' });
    }
  },

  // Obtener auto por ID de usuario (para vista cliente)
  getCarByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const car = await Car.findOne({
        where: { user_id: userId },
        include: {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      });

      if (!car) {
        return res.status(404).json({ message: 'Carro no encontrado para este usuario' });
      }

      res.json(car);
    } catch (error) {
      console.error('Error al obtener el carro por usuario:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

module.exports = carController;
