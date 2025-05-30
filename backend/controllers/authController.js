const db = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body
  console.log(email)
  console.log(password)
  try {
    const user = await db.Users.findOne({ where: { email } })
    console.log('------------------')
    console.log(user)
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' })
      
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ msg: 'Contraseña incorrecta' })
      // console.log(isMatch)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    res.json({ token, role: user.role })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'Error del servidor' })
  } 
}

const register = async (req, res) => {
  const { email, password, role } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
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
