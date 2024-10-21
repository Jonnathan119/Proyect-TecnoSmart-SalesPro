import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Card, CardContent, Typography, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
} from '@mui/material';

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/sales/history');
      setSales(response.data);
    } catch (error) {
      console.error('Error al obtener el historial de ventas:', error);
      setError('Error al obtener el historial de ventas.');
    } finally {
      setLoading(false);
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
          maxWidth: 900,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Historial de Ventas
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : sales.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              No hay ventas registradas.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#80cbc4' }}>ID Venta</TableCell>
                    <TableCell sx={{ color: '#80cbc4' }}>Fecha</TableCell>
                    <TableCell sx={{ color: '#80cbc4' }}>Cliente</TableCell>
                    <TableCell sx={{ color: '#80cbc4' }}>Producto</TableCell>
                    <TableCell sx={{ color: '#80cbc4' }}>Cantidad</TableCell>
                    <TableCell sx={{ color: '#80cbc4' }}>Total</TableCell>
                    <TableCell sx={{ color: '#80cbc4' }}>Venta a Crédito</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.sale_id}>
                      <TableCell sx={{ color: '#fff' }}>{sale.sale_id}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{sale.sale_date}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{sale.client_name}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{sale.product_name}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{sale.quantity}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{sale.total_price}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{sale.is_credit ? 'Sí' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SalesHistory;
