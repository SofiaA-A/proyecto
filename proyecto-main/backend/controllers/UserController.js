// controllers/userController.js
const { User } = require('../models')
const bcrypt = require('bcrypt')

exports.crearUsuario = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log ('-------')

    const nuevoUsuario = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    res.status(201).json({ message: 'Usuario creado correctamente', user: nuevoUsuario })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message })
  }
}
