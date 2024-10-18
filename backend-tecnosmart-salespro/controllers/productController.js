const db = require('../config/db');

// Obtener todos los productos
exports.getProducts = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
};

// Crear un nuevo producto
exports.createProduct = (req, res) => {
  const { name, description, price, quantity, category } = req.body;

  if (!name || !price || !quantity) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  db.query('INSERT INTO products (name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?)', 
    [name, description, price, quantity, category], 
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al crear producto' });
      }
      res.status(201).json({ message: 'Producto creado exitosamente' });
    }
  );
};

// Actualizar un producto
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category } = req.body;

  db.query(
    'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?',
    [name, description, price, quantity, category, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar producto' });
      }
      res.json({ message: 'Producto actualizado exitosamente' });
    }
  );
};

// Eliminar un producto
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  });
};
