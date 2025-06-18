const { User } = require('../models');
const bcrypt = require('bcrypt');

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' }); 
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      res.json({ message: 'Login exitoso', user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};

module.exports = authController;
