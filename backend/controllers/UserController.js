const { User } = require('../models');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'lastname', 'email', 'role'] // Evita mandar password
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role']
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

// Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
  const { name,lastname, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      role
    });
    res.status(201).json({ message: 'Usuario creado correctamente', user: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

// Editar usuario
exports.editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { name, lastname, email, password, role } = req.body;
  try {
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Solo actualiza la contraseña si se envió
    if (password && password !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      await usuario.update({ name, lastname, email, password: hashedPassword, role });
    } else {
      await usuario.update({ name, lastname, email, role });
    }

    res.json({ message: 'Usuario actualizado correctamente', user: usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};
