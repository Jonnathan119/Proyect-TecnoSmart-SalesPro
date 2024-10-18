const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Obtener todos los productos
router.get('/', getProducts);

// Crear un nuevo producto
router.post('/', createProduct);

// Actualizar un producto
router.put('/:id', updateProduct);

// Eliminar un producto
router.delete('/:id', deleteProduct);

module.exports = router;
