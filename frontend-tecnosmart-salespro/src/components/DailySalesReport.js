import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Card,CardContent, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert,
} from '@mui/material';

function DailySalesReport() {
  const [date, setDate] = useState('');
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');

  const fetchDailySales = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/reports/sales/daily?date=${date}`);
      setSales(response.data);
      setError('');
    } catch (error) {
      console.error('Error al obtener el informe de ventas diarias:', error);
      setError('No se pudo obtener el informe de ventas diarias.');
    }
  };

  const downloadExcel = () => {
    window.open(`http://localhost:5002/api/reports/sales/daily/excel?date=${date}`);
  };

  const downloadPDF = () => {
    window.open(`http://localhost:5002/api/reports/sales/daily/pdf?date=${date}`);
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
            Informe de Ventas Diarias
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ shrink: true, style: { color: '#ccc' } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={fetchDailySales}
              disabled={!date}
              sx={{ backgroundColor: '#00796b' }}
            >
              Buscar
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              onClick={downloadExcel}
              disabled={!date}
              sx={{ backgroundColor: '#4caf50' }}
            >
              Exportar a Excel
            </Button>
            <Button
              variant="contained"
              onClick={downloadPDF}
              disabled={!date}
              sx={{ backgroundColor: '#d32f2f' }}
            >
              Exportar a PDF
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#80cbc4' }}>ID Venta</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Cliente</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Producto</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Cantidad</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Total</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.sale_id}>
                    <TableCell sx={{ color: '#fff' }}>{sale.sale_id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{sale.client_name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{sale.product_name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{sale.quantity}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{sale.total_price}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{sale.sale_date}</TableCell>
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

export default DailySalesReport;
