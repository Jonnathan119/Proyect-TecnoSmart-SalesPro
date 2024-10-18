const express = require('express');
const router = express.Router();
const { createSale, getSales, getDailySalesReport, getMonthlySalesReport } = require('../controllers/salesController');

// Registrar una nueva venta
router.post('/', createSale);

// Obtener el historial de ventas
router.get('/history', getSales);

router.get('/report/daily', getDailySalesReport);

// Ruta para el informe de ventas mensuales
router.get('/report/monthly', getMonthlySalesReport);

module.exports = router;
