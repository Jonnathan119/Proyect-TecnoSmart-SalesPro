const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const protect = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, token no encontrado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = { protect };
