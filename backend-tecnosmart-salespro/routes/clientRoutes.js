const express = require('express');
const router = express.Router();
const { getClients, createClient, updateClient, deleteClient } = require('../controllers/clientController');

// Obtener todos los clientes
router.get('/', getClients);

// Crear un nuevo cliente
router.post('/', createClient);

// Actualizar un cliente
router.put('/:id', updateClient);

// Eliminar un cliente
router.delete('/:id', deleteClient);

module.exports = router;
