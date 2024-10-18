const db = require('../config/db');

// código de registro de una cuenta nueva a crédito
exports.createAccountReceivable = (req, res) => {
  const { client_id, sale_id, total_due, due_date } = req.body;

  if (!client_id || !total_due) {
    return res.status(400).json({ message: 'Cliente y total debido son obligatorios' });
  }

  db.query(
    'INSERT INTO accounts_receivable (client_id, sale_id, total_due, due_date) VALUES (?, ?, ?, ?)',
    [client_id, sale_id, total_due, due_date],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al crear cuenta por cobrar' });
      }
      res.status(201).json({ message: 'Cuenta por cobrar registrada exitosamente' });
    }
  );
};

// Registrar un pago
exports.recordPayment = (req, res) => {
  const { account_id, amount_paid } = req.body;

  if (!account_id || !amount_paid) {
    return res.status(400).json({ message: 'ID de la cuenta y monto pagado son obligatorios' });
  }

  db.query(
    'UPDATE accounts_receivable SET total_paid = total_paid + ? WHERE id = ?',
    [amount_paid, account_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar el pago' });
      }
      res.json({ message: 'Pago registrado exitosamente' });
    }
  );
};

// Consultar saldo de un cliente
exports.getClientBalance = (req, res) => {
  const { client_id } = req.params;

  db.query(
    'SELECT * FROM accounts_receivable WHERE client_id = ?',
    [client_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener el saldo del cliente' });
      }

      // Calcular el saldo pendiente total
      const totalDue = results.reduce((sum, account) => sum + account.total_due, 0);
      const totalPaid = results.reduce((sum, account) => sum + account.total_paid, 0);
      const balance = totalDue - totalPaid;

      res.json({ accounts: results, balance });
    }
  );
};

// Obtener informe de cuentas a crédito
exports.getAccountsReceivableReport = (req, res) => {
  db.query(
    'SELECT clients.id AS client_id, clients.name, SUM(total_due - total_paid) AS balance FROM accounts_receivable JOIN clients ON accounts_receivable.client_id = clients.id GROUP BY clients.id, clients.name HAVING balance > 0',
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener informe de cuentas por cobrar' });
      }
      res.json(results);
    }
  );
};

exports.recordPayment = (req, res) => {
    const { account_id, amount_paid, payment_date } = req.body;
  
    if (!account_id || !amount_paid || !payment_date) {
      return res.status(400).json({ message: 'ID de la cuenta, monto pagado y fecha de pago son obligatorios' });
    }
  
    // registro en la base de datos
    db.query(
      'INSERT INTO payments (account_id, amount, payment_date) VALUES (?, ?, ?)',
      [account_id, amount_paid, payment_date],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error al registrar el pago' });
        }
  
        // Actualización de pago en la base de datos
        db.query(
          'UPDATE accounts_receivable SET total_paid = total_paid + ? WHERE id = ?',
          [amount_paid, account_id],
          (err, updateResult) => {
            if (err) {
              return res.status(500).json({ error: 'Error al actualizar la cuenta por cobrar' });
            }
            res.json({ message: 'Pago registrado exitosamente' });
          }
        );
      }
    );
  };
  
  
  // Obtener el historial de pagos de una cuenta específica
  exports.getPaymentHistory = (req, res) => {
    const { account_id } = req.params;
  
    db.query(
      'SELECT * FROM payments WHERE account_id = ? ORDER BY payment_date DESC',
      [account_id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error al obtener el historial de pagos' });
        }
        res.json(results);
      }
    );
  };
  