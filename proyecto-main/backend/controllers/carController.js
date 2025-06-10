const { Car } = require('../models')

const getAutos = async (req, res) => {
  try {
    const autos = await Car.findAll()
    res.json(autos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Error al obtener los autos' })
  }
}

module.exports = { getAutos }
