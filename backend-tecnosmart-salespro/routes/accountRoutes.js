const express = require('express');
const router = express.Router();
const {
  createAccountReceivable,
  recordPayment,
  getClientBalance,
  getAccountsReceivableReport,
  getPaymentHistory
} = require('../controllers/accountController');

// Ruta para registrar créditos
router.post('/create', createAccountReceivable);

// Ruta para registrar un pago
router.post('/payment', recordPayment);

// Ruta para obtener el saldo de un cliente
router.get('/balance/:client_id', getClientBalance);

// Ruta para obtener el informe de cuentas por cobrar
router.get('/report', getAccountsReceivableReport);

// Ruta para registrar un pago
router.post('/payment', recordPayment);

// Ruta para obtener el historial de pagos de una cuenta específica
router.get('/payment/history/:account_id', getPaymentHistory);

module.exports = router;
