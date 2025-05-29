const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ msg: 'Contraseña incorrecta' })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    res.json({ token, role: user.role })
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' })
  }
}

const register = async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ msg: 'Error al registrar' })
  }
}

module.exports = { login, register }
