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

  // Crear un nuevo auto (con imagen)
  createCar: async (req, res) => {
    try {
      console.log('req.body:', req.body);
      console.log('req.file:', req.file);

      const { brand, model, plate, year, lat, lng } = req.body;
      let { user_id } = req.body;

      if (!brand || !model || !plate || !year || !lat || !lng) {
        return res.status(400).json({ message: 'Faltan datos requeridos (marca, modelo, placa, año, lat, lng)' });
      }

      if (!user_id || user_id === '' || user_id === 'null') {
        user_id = null;
      } else {
        user_id = parseInt(user_id);
        if (isNaN(user_id)) user_id = null;
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : `/images/CarDefecto.png`

      const car = await Car.create({
        brand,
        model,
        plate,
        year: parseInt(year),
        latlong: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        user_id,
        image: imagePath
      });

      res.status(201).json(car);
    } catch (err) {
      console.error('Error al crear auto:', err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'La placa ya está registrada' });
      }
      res.status(500).json({ message: 'Error al crear auto' });
    }
  },

  // Actualizar un auto existente (con manejo imagen)
  updateCar: async (req, res) => {
    try {
      const { id } = req.params;
      const { brand, model, plate, year, lat, lng } = req.body;
      let { user_id } = req.body;

      const car = await Car.findByPk(id);
      if (!car) {
        return res.status(404).json({ message: 'Auto no encontrado' });
      }

      if (!user_id || user_id === '' || user_id === 'null') {
        user_id = null;
      } else {
        user_id = parseInt(user_id);
        if (isNaN(user_id)) user_id = null;
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : car.image;

      await car.update({
        brand,
        model,
        plate,
        year: parseInt(year),
        latlong: (lat && lng)
          ? { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }
          : car.latlong,
        user_id,
        image: imagePath
      });

      res.json({ message: 'Auto actualizado', car });
    } catch (err) {
      console.error('Error al actualizar auto:', err);
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
  },

  // Obtener autos disponibles (no asignados)
  getAvailableCars: async (req, res) => {
    try {
      const cars = await Car.findAll({
        where: { user_id: null }
      });
      res.json(cars);
    } catch (error) {
      console.error('Error al obtener autos disponibles:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Asignar auto a un usuario
  assignCarToUser: async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      const car = await Car.findByPk(id);
      if (!car) {
        return res.status(404).json({ message: 'Auto no encontrado' });
      }

      if (car.user_id) {
        return res.status(400).json({ message: 'Este auto ya fue asignado a otro usuario' });
      }

      const existingCar = await Car.findOne({ where: { user_id: userId } });
      if (existingCar) {
        return res.status(400).json({ message: 'Este usuario ya tiene un auto asignado' });
      }

      car.user_id = userId;
      await car.save();

      res.json({ message: 'Auto asignado correctamente', car });
    } catch (error) {
      console.error('Error al asignar auto:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

module.exports = carController;
