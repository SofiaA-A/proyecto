const { Route, Car, User } = require('../models');

const routeController = {
  // Obtener todas las rutas
  async getAll(req, res) {
    try {
      const routes = await Route.findAll({
        include: [
          { model: Car, as: 'car' },
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
        ],
        attributes: ['id', 'car_id', 'user_id', 'latlong', 'createdAt', 'updatedAt']
      });

      const formattedRoutes = routes.map(route => {
        const data = route.toJSON();
        const coords = data.latlong?.coordinates || [0, 0];
        return {
          ...data,
          lng: coords[0],
          lat: coords[1]
        };
      });

      res.json(formattedRoutes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener las rutas' });
    }
  },

  // Obtener ruta por ID
  async getById(req, res) {
    try {
      const route = await Route.findByPk(req.params.id, {
        include: [
          { model: Car, as: 'car' },
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
        ]
      });
      if (!route) return res.status(404).json({ error: 'Ruta no encontrada' });
      res.json(route);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener la ruta' });
    }
  },

  // Crear nueva ruta
  async create(req, res) {
    try {
      const { lat, lng, car_id } = req.body;

      if (
        lat === undefined ||
        lng === undefined ||
        car_id === undefined ||
        isNaN(Number(lat)) ||
        isNaN(Number(lng))
      ) {
        return res.status(400).json({ error: 'Latitud y longitud deben ser valores numéricos válidos' });
      }

      const latNum = Number(lat);
      const lngNum = Number(lng);

      // Validar rango
      if (latNum < -90 || latNum > 90) {
        return res.status(400).json({ error: 'La latitud debe estar entre -90 y 90 grados' });
      }
      if (lngNum < -180 || lngNum > 180) {
        return res.status(400).json({ error: 'La longitud debe estar entre -180 y 180 grados' });
      }

      // Buscar el carro primero
      const car = await Car.findByPk(car_id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name']
          }
        ]
      });
      if (!car) return res.status(404).json({ error: 'Auto no encontrado' });

      // Crear la ruta con user_id tomado del carro
      const route = await Route.create({
        car_id: car.id,
        user_id: car.user_id,
        latlong: { type: 'Point', coordinates: [lngNum, latNum] }
      });

      res.status(201).json(route);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear la ruta' });
    }
  },

  // Actualizar ruta existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const { lat, lng, car_id, user_id } = req.body;

      if (
        (lat !== undefined && isNaN(Number(lat))) ||
        (lng !== undefined && isNaN(Number(lng)))
      ) {
        return res.status(400).json({ error: 'Latitud y longitud deben ser valores numéricos válidos' });
      }

      const latNum = lat !== undefined ? Number(lat) : undefined;
      const lngNum = lng !== undefined ? Number(lng) : undefined;

      // Validar rango si vienen
      if (latNum !== undefined && (latNum < -90 || latNum > 90)) {
        return res.status(400).json({ error: 'La latitud debe estar entre -90 y 90 grados' });
      }
      if (lngNum !== undefined && (lngNum < -180 || lngNum > 180)) {
        return res.status(400).json({ error: 'La longitud debe estar entre -180 y 180 grados' });
      }

      const route = await Route.findByPk(id);
      if (!route) return res.status(404).json({ error: 'Ruta no encontrada' });

      await route.update({
        car_id: car_id || route.car_id,
        user_id: user_id || route.user_id,
        latlong:
          latNum !== undefined && lngNum !== undefined
            ? { type: 'Point', coordinates: [lngNum, latNum] }
            : route.latlong
      });

      res.json({ message: 'Ruta actualizada', route });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar la ruta' });
    }
  },

  // Eliminar ruta
  async delete(req, res) {
    try {
      const { id } = req.params;
      const route = await Route.findByPk(id);
      if (!route) return res.status(404).json({ error: 'Ruta no encontrada' });

      await route.destroy();
      res.json({ message: 'Ruta eliminada correctamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar la ruta' });
    }
  },

  // Obtener rutas por carro (con info del carro)
  async getRoutesByCarId(req, res) {
    try {
      const { carId } = req.params;

      const car = await Car.findByPk(carId);
      if (!car) return res.status(404).json({ error: 'Carro no encontrado' });

      const routes = await Route.findAll({
        where: { car_id: carId },
        include: [
          {
            model: Car,
            as: 'car'
          },
          {
            model: User,
            as: 'user',
            attributes: ['name'] // Solo trae lo necesario
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      res.json({ car, routes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener las rutas del carro' });
    }
  }
};

module.exports = routeController;
