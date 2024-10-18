const db = require('../config/db');

// Obtener todos los clientes
exports.getClients = (req, res) => {
  db.query('SELECT * FROM clients', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener clientes' });
    }
    res.json(results);
  });
};

// creación de cliente
exports.createClient = (req, res) => {
    const { cedula, name, expedition_date, expedition_place, email, phone, address } = req.body;
  
    if (!cedula || !name) {
      return res.status(400).json({ message: 'El número de cédula y el nombre son obligatorios' });
    }
  
    // Verificar si la cédula ya está registrada
    db.query('SELECT * FROM clients WHERE cedula = ?', [cedula], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al verificar la cédula' });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: 'La cédula ya está registrada' });
      }
  
      // Insertar el cliente si la cédula no existe
      db.query('INSERT INTO clients (cedula, name, expedition_date, expedition_place, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [cedula, name, expedition_date, expedition_place, email, phone, address],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al crear el cliente' });
          }
          res.status(201).json({ message: 'Cliente creado exitosamente' });
        }
      );
    });
  };
  
// actualización cliente
  exports.updateClient = (req, res) => {
    const { id } = req.params;
    const { cedula, name, expedition_date, expedition_place, email, phone, address } = req.body;
  
    if (!cedula || !name) {
      return res.status(400).json({ message: 'El número de cédula y el nombre son obligatorios' });
    }
  
    // Verificación si la cédula ya está registrada por otro cliente
    db.query('SELECT * FROM clients WHERE cedula = ? AND id != ?', [cedula, id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al verificar la cédula' });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: 'La cédula ya está registrada por otro cliente' });
      }
  
      // Actualizar el cliente si la cédula no está duplicada
      db.query(
        'UPDATE clients SET cedula = ?, name = ?, expedition_date = ?, expedition_place = ?, email = ?, phone = ?, address = ? WHERE id = ?',
        [cedula, name, expedition_date, expedition_place, email, phone, address, id],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al actualizar el cliente' });
          }
          res.json({ message: 'Cliente actualizado exitosamente' });
        }
      );
    });
  };
  

// Eliminar un cliente
exports.deleteClient = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM clients WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
    res.json({ message: 'Cliente eliminado exitosamente' });
  });
};
