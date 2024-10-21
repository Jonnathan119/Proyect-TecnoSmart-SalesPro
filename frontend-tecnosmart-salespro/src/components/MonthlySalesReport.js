import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, CircularProgress,
} from '@mui/material';

function MonthlySalesReport() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5002/api'; 

  const fetchMonthlySales = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/reports/sales/monthly`, {
        params: { year, month },
      });
      setSales(response.data);
    } catch (error) {
      console.error('Error al obtener el informe de ventas mensuales:', error);
      setError('No se pudo obtener el informe de ventas mensuales.');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/sales/monthly/excel`, {
        params: { year, month },
        responseType: 'blob', 
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Informe_Ventas_Mensuales_${year}_${month}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      setError('No se pudo exportar el informe a Excel.');
    }
  };

  const exportToPDF = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/sales/monthly/pdf`, {
        params: { year, month },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Informe_Ventas_Mensuales_${year}_${month}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      setError('No se pudo exportar el informe a PDF.');
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
            Informe de Ventas Mensuales
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
            <TextField
              label="Año"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ shrink: true, style: { color: '#ccc' } }}
              inputProps={{ min: 2000, max: 2100 }}
            />
            <TextField
              label="Mes (1-12)"
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ shrink: true, style: { color: '#ccc' } }}
              inputProps={{ min: 1, max: 12 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={fetchMonthlySales}
              disabled={loading || !year || !month}
              sx={{ backgroundColor: '#00796b' }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Buscar'}
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {sales.length > 0 && (
            <>
              <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', mt: 2 }}>
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

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={exportToExcel}
                  sx={{ backgroundColor: '#4caf50' }}
                >
                  Exportar a Excel
                </Button>
                <Button
                  variant="contained"
                  onClick={exportToPDF}
                  sx={{ backgroundColor: '#d32f2f' }}
                >
                  Exportar a PDF
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MonthlySalesReport;

