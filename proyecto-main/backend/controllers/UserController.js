const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

exports.crearUsuario = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    res.status(201).json({ message: 'Usuario creado correctamente', user: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

exports.editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await usuario.update({ name, email, password: hashedPassword, role });

    res.json({ message: 'Usuario actualizado correctamente', user: usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

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
