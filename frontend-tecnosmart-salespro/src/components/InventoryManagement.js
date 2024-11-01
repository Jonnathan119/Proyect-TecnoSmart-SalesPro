import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert,
} from '@mui/material';

function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  });
  const [editProductId, setEditProductId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setError('Error al obtener productos.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editProductId) {
        await axios.put(`http://localhost:5002/api/products/${editProductId}`, form);
        setSuccess('Producto actualizado exitosamente.');
      } else {
        await axios.post('http://localhost:5002/api/products', form);
        setSuccess('Producto creado exitosamente.');
      }

      setForm({ name: '', description: '', price: '', quantity: '', category: '' });
      setEditProductId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setError('Error al enviar el formulario.');
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditProductId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/products/${id}`);
      fetchProducts();
      setSuccess('Producto eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setError('Error al eliminar producto.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/images/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 128, 128, 0.6)',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
          padding: '20px',
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Gestión de Inventario
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre del Producto"
              name= "Nombre del Producto"
              variant="outlined"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
              required
            />
            <TextField
              label="Descripción"
              name= "Descripción"
              variant="outlined"
              fullWidth
              margin="normal"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
            <TextField
              label="Precio"
              name= "Precio"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
              required
            />
            <TextField
              label="Cantidad"
              name="Cantidad"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
              required
            />
            <TextField
              label="Categoría"
              name= "Categoría"
              variant="outlined"
              fullWidth
              margin="normal"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, backgroundColor: '#00796b' }}
            >
              {editProductId ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
          </form>

          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Lista de Productos
          </Typography>

          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#80cbc4' }}>Nombre</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Descripción</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Precio</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Cantidad</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Categoría</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell sx={{ color: '#fff' }}>{product.name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.description}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.price}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.quantity}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.category}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        name= "Editar"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(product)}
                        sx={{ mr: 1, backgroundColor: '#00796b' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(product.id)}
                        sx={{ backgroundColor: '#d32f2f' }}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default InventoryManagement;
