const db = require('../config/db');

// Informe de ventas por día
exports.getDailySalesReport = (req, res) => {
  const { date } = req.query; 

  const query = `
    SELECT 
      sales.id AS sale_id, 
      clients.name AS client_name, 
      products.name AS product_name, 
      sales.quantity, 
      sales.total_price, 
      sales.sale_date 
    FROM sales
    JOIN clients ON sales.client_id = clients.id
    JOIN products ON sales.product_id = products.id
    WHERE DATE(sales.sale_date) = ?
    ORDER BY sales.sale_date DESC;
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error('Error al obtener el informe de ventas diarias:', err);
      return res.status(500).json({ error: 'Error al obtener el informe de ventas diarias' });
    }

    res.json(results);
  });
};

exports.getMonthlySalesReport = (req, res) => {
  const { year, month } = req.query; 

  const query = `
    SELECT 
      sales.id AS sale_id, 
      clients.name AS client_name, 
      products.name AS product_name, 
      sales.quantity, 
      sales.total_price, 
      sales.sale_date 
    FROM sales
    JOIN clients ON sales.client_id = clients.id
    JOIN products ON sales.product_id = products.id
    WHERE YEAR(sales.sale_date) = ? AND MONTH(sales.sale_date) = ?
    ORDER BY sales.sale_date DESC;
  `;

  db.query(query, [year, month], (err, results) => {
    if (err) {
      console.error('Error al obtener el informe de ventas mensuales:', err);
      return res.status(500).json({ error: 'Error al obtener el informe de ventas mensuales' });
    }

    res.json(results);
  });
};

// Informe de productos con bajo stock
exports.getLowStockReport = (req, res) => {
    db.query(
      'SELECT id, name, quantity, price FROM products WHERE quantity < 10',
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al obtener productos con bajo stock' });
        }
        res.json(results);
      }
    );
  };
  
  // Informe de estado general del inventario
  exports.getInventoryReport = (req, res) => {
    db.query(
      'SELECT id, name, quantity, price, (quantity * price) AS total_value FROM products',
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al obtener el estado del inventario' });
        }
        res.json(results);
      }
    );
  };
// Informe de ventas por cliente
exports.getSalesByClient = (req, res) => {
    db.query(
      'SELECT clients.id, clients.name, SUM(sales.total) AS total_spent FROM clients JOIN sales ON clients.id = sales.client_id GROUP BY clients.id, clients.name ORDER BY total_spent DESC',
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al obtener informe de ventas por cliente' });
        }
        res.json(results);
      }
    );
  };
  
  // Detalle de ventas de un cliente específico
  exports.getSalesDetailByClient = (req, res) => {
    const clientId = req.params.id;
    db.query(
      'SELECT sales.id, sales.sale_date, sales.total FROM sales WHERE sales.client_id = ?',
      [clientId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al obtener detalles de ventas del cliente' });
        }
        res.json(results);
      }
    );
  };
    // Informe de la lista general de clientes
exports.getClientsReport = (req, res) => {
    db.query(
      'SELECT id, cedula, name, email, phone, address, created_at FROM clients ORDER BY created_at DESC',
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al obtener informe de clientes' });
        }
        res.json(results);
      }
    );
  };
  
  // Informe de total de compras por cliente
  exports.getClientPurchasesReport = (req, res) => {
    db.query(
      'SELECT clients.id, clients.cedula, clients.name, SUM(sales.total) AS total_spent FROM clients LEFT JOIN sales ON clients.id = sales.client_id GROUP BY clients.id, clients.cedula, clients.name ORDER BY total_spent DESC',
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al obtener informe de compras por cliente' });
        }
        res.json(results);
      }
    );
  };
  