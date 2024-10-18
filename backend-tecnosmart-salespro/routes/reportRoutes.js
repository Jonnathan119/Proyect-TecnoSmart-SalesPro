const express = require('express');
const router = express.Router();
const {
  getLowStockReport,
  getInventoryReport,
  getClientsReport,
  getClientPurchasesReport,
  getSalesByClient,
  getSalesDetailByClient
   } = require('../controllers/reportController');
   const {
  getDailySalesReport,
  getMonthlySalesReport,
  exportDailySalesToExcel, 
  exportMonthlySalesToExcel, 
  exportDailySalesToPDF, 
  exportMonthlySalesToPDF
   } = require('../controllers/salesController');

console.log('getDailySalesReport:', getDailySalesReport);
console.log('getMonthlySalesReport:', getMonthlySalesReport);
console.log('exportDailySalesToExcel:', exportDailySalesToExcel);
console.log('exportMonthlySalesToExcel:', exportMonthlySalesToExcel);
console.log('exportDailySalesToPDF:', exportDailySalesToPDF);
console.log('exportMonthlySalesToPDF:', exportMonthlySalesToPDF);

// Informe de lista general de clientes
router.get('/clients', getClientsReport);

// Informe de total de compras por cliente
router.get('/clients/purchases', getClientPurchasesReport);

// Informe de ventas por día
router.get('/sales/daily', getDailySalesReport);

// Informe de ventas por mes
router.get('/sales/monthly', getMonthlySalesReport);

router.get('/sales/daily/excel', exportDailySalesToExcel);

// Exportar informe de ventas mensuales a Excel
router.get('/sales/monthly/excel', exportMonthlySalesToExcel);

// Exportar informe de ventas diarias a PDF
router.get('/sales/daily/pdf', exportDailySalesToPDF);

// Exportar informe de ventas mensuales a PDF
router.get('/sales/monthly/pdf', exportMonthlySalesToPDF);

// Informe de productos con bajo stock
router.get('/inventory/low-stock', getLowStockReport);

// Informe del estado general del inventario
router.get('/inventory/general', getInventoryReport);

// Informe de ventas por cliente
router.get('/sales/client', getSalesByClient);

// Detalle de ventas de un cliente específico
router.get('/sales/client/:id', getSalesDetailByClient);

module.exports = router;
