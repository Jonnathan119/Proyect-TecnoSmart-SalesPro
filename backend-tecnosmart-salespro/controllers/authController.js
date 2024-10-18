const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

// Registrar un nuevo usuario
exports.register = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar si el usuario ya existe
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role], (err, result) => {
      if (err) throw err;
      return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
  });
};

// Iniciar sesión
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar si el usuario existe
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  });
};
