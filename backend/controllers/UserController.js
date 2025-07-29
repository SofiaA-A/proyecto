const { User } = require('../models')
const bcrypt = require('bcrypt')

const { Op } = require('sequelize')  // Agrega esto arriba en el archivo junto con tus imports

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const offset = (page - 1) * limit

    const { name, email } = req.query

    // Armar condiciones dinámicas para el filtro
    const where = {}

    if (name) {
      where.name = { [Op.like]: `%${name}%` }  // filtro parcial nombre
    }
    if (email) {
      where.email = { [Op.like]: `%${email}%` }  // filtro parcial email
    }

    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'name', 'lastname', 'email', 'image', 'role'], // sin password
      limit,
      offset,
      order: [['id', 'ASC']],
      where  // <-- aplicamos los filtros aquí
    })

    res.json({
      users: rows,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message })
  }
}

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'lastname', 'email', 'image', 'role']
    })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
  }
}

// Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { name, lastname, email, password, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    // Si se subió una imagen, guarda el path
   const image = req.file ? `/ImagesUsers/${req.file.filename}` : `/images/imageDefecto.png`


    const nuevoUsuario = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      role,
      image
    })

    res.status(201).json({ message: 'Usuario creado correctamente', user: nuevoUsuario })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message })
  }
}

  // Obtener todos los usuarios sin paginación (para selects, etc.)
exports.getAllWithoutPagination = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'lastname', 'email']
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener todos los usuarios', error: error.message })
  }
}


// Editar usuario
exports.editarUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { name, lastname, email, password, role } = req.body

    const usuario = await User.findByPk(id)
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })

    // Si se subió una nueva imagen, usamos su path; si no, conservamos la existente
    const image = req.file ? `/images/${req.file.filename}` : usuario.image

    // Actualiza la contraseña solo si se envió
    let updatedFields = { name, lastname, email, role, image }
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10)
      updatedFields.password = hashedPassword
    }

    await usuario.update(updatedFields)

    res.json({ message: 'Usuario actualizado correctamente', user: usuario })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message })
  }
}

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const usuario = await User.findByPk(id)
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })

    await usuario.destroy()
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message })
  }
}
