const { User } = require('../models');
const bcrypt = require('bcrypt');

const authController = {

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' }); 
      }
      console.log();

      // Comparar password recibido con el hash almacenado
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Si todo bien, devolver éxito (aquí podrías generar token JWT)
      res.json({ message: 'Login exitoso', user: { id: user.id, email: user.email, name: user.name } });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // Ejemplo para registrar un usuario con password encriptada
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Validar si ya existe el email
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email ya registrado' });
      }

      // Hashear la contraseña antes de guardar
      const hashedPassword = await bcrypt.hash(password, 10);


      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role
      });

      res.status(201).json({ message: 'Usuario registrado', user: { id: newUser.id, email: newUser.email, name: newUser.name } });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

};

module.exports = authController;
