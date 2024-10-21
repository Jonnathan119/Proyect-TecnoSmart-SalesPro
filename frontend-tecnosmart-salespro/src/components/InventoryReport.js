import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert,
} from '@mui/material';

function InventoryReport() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLowStockReport();
    fetchInventoryReport();
  }, []);

  const fetchLowStockReport = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/reports/inventory/low-stock');
      setLowStockProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos con bajo stock:', error);
      setError('No se pudo obtener la lista de productos con bajo stock.');
    }
  };

  const fetchInventoryReport = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/reports/inventory/general');
      setInventory(response.data);
    } catch (error) {
      console.error('Error al obtener el estado del inventario:', error);
      setError('No se pudo obtener el estado general del inventario.');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Estado General del Inventario', 10, 10);

    const tableColumn = ["ID", "Producto", "Cantidad", "Precio Unitario", "Valor Total"];
    const tableRows = inventory.map((product) => [
      product.id,
      product.name,
      product.quantity,
      product.price,
      product.total_value,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('inventario.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(inventory);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');
    XLSX.writeFile(workbook, 'inventario.xlsx');
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
          padding: '20px',
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Informe de Inventario
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Typography variant="h6" sx={{ mt: 2 }}>
            Productos con Bajo Stock
          </Typography>
          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', mt: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#80cbc4' }}>ID</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Producto</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Cantidad</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Precio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell sx={{ color: '#fff' }}>{product.id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.quantity}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ mt: 4 }}>
            Estado General del Inventario
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              onClick={exportToPDF}
              sx={{ backgroundColor: '#d32f2f' }}
            >
              Exportar a PDF
            </Button>
            <Button
              variant="contained"
              onClick={exportToExcel}
              sx={{ backgroundColor: '#4caf50' }}
            >
              Exportar a Excel
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', mt: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#80cbc4' }}>ID</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Producto</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Cantidad</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Precio Unitario</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell sx={{ color: '#fff' }}>{product.id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.quantity}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.price}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{product.total_value}</TableCell>
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

export default InventoryReport;

