const { Route } = require('../models');

module.exports = {
  // Obtener todas las rutas
  async getAll(req, res) {
    try {
      const routes = await Route.findAll({ include: ['car', 'user'] });
      res.json(routes);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener las rutas' });
    }
  },

  // Obtener ruta por ID
  async getById(req, res) {
    try {
      const route = await Route.findByPk(req.params.id, { include: ['car', 'user'] });
      if (!route) return res.status(404).json({ error: 'Ruta no encontrada' });
      res.json(route);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener la ruta' });
    }
  },

  // Crear nueva ruta
  async create(req, res) {
    try {
      const { longitude, latitude, car_id, user_id } = req.body;
      const route = await Route.create({ longitude, latitude, car_id, user_id });
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
      const route = await Route.findByPk(id);
      if (!route) return res.status(404).json({ error: 'Ruta no encontrada' });
      await route.update(req.body);
      res.json(route);
    } catch (err) {
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
      res.status(500).json({ error: 'Error al eliminar la ruta' });
    }
  },

  // Obtener rutas por userId
  async getRoutesByUserId(req, res) {
    try {
      const userId = req.params.userId;
      const routes = await Route.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'ASC']]
      });
      res.json(routes);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener las rutas del usuario' });
    }
  }
};
