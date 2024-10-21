import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel, Alert,
} from '@mui/material';

function SalesManagement() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [client, setClient] = useState('');
  const [isCredit, setIsCredit] = useState(false);
  const [error, setError] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    const response = await axios.get('http://localhost:5002/api/clients');
    setClients(response.data);
  };

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5002/api/products');
    setProducts(response.data);
  };

  const handleAddProduct = (product, quantity) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: quantity } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setShowSummary(true);
  };

  const handleConfirmSale = async () => {
    try {
      const saleData = {
        client_id: client,
        products: selectedProducts.map((p) => ({
          product_id: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        is_credit: isCredit,
      };

      console.log('Datos de la venta enviados:', saleData);

      await axios.post('http://localhost:5002/api/sales', saleData);
      alert('Venta registrada exitosamente');
      setSelectedProducts([]);
      setShowSummary(false);
      setIsCredit(false);
    } catch (error) {
      console.error('Error al registrar la venta:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Error al registrar la venta');
    }
  };

  const handleCancelSale = () => {
    setShowSummary(false);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
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
          maxWidth: 600,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Registrar Venta
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          {!showSummary ? (
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel style={{ color: '#ccc' }}>Cliente</InputLabel>
                <Select
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                  }}
                  required
                >
                  <MenuItem value="">
                    <em>Seleccionar Cliente</em>
                  </MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {products.map((product) => (
                <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ flexGrow: 1 }}>
                    {product.name} - {product.price} (Stock: {product.quantity})
                  </Typography>
                  <TextField
                    type="number"
                    placeholder="Cantidad"
                    inputProps={{ min: 1, max: product.quantity }}
                    sx={{ width: '100px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                    onChange={(e) =>
                      handleAddProduct(product, parseInt(e.target.value, 10))
                    }
                  />
                </Box>
              ))}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCredit}
                    onChange={(e) => setIsCredit(e.target.checked)}
                    sx={{ color: '#80cbc4' }}
                  />
                }
                label="Venta a Crédito"
                style={{ color: '#80cbc4' }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, backgroundColor: '#00796b' }}
              >
                Ver Resumen
              </Button>
            </form>
          ) : (
            <div>
              <Typography variant="h6" align="center" gutterBottom>
                Resumen de la Venta
              </Typography>
              <Box sx={{ mt: 2 }}>
                {selectedProducts.map((product) => (
                  <Box key={product.id} sx={{ mb: 1 }}>
                    <Typography>
                      {product.name} - {product.quantity} unidades - Precio unitario: {product.price} - Total: {product.price * product.quantity}
                    </Typography>
                  </Box>
                ))}
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Total de la venta: {calculateTotal()}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  {isCredit ? 'Esta venta será registrada como crédito.' : 'Esta venta será al contado.'}
                </Typography>
              </Box>
              <Button
                onClick={handleConfirmSale}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, backgroundColor: '#00796b' }}
              >
                Confirmar Venta
              </Button>
              <Button
                onClick={handleCancelSale}
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SalesManagement;
