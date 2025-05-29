const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware')
const { Route, Car, User } = require('../models')

// Admin: ver todos los recorridos
router.get('/admin', verifyToken, isAdmin, async (req, res) => {
  const recorridos = await Route.findAll({ include: Car })
  res.json(recorridos)
})

// Usuario: ver solo los recorridos de su auto
router.get('/usuario', verifyToken, async (req, res) => {
  const car = await Car.findOne({ where: { user_id: req.user.id } })
  if (!car) return res.status(404).json({ msg: 'No tiene auto asignado' })

  const recorridos = await Route.findAll({ where: { car_id: car.id } })
  res.json(recorridos)
})

module.exports = router
