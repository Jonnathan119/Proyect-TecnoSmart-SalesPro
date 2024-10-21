import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert,
} from '@mui/material';

function SalesByClientReport() {
  const [clients, setClients] = useState([]);
  const [clientSales, setClientSales] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalesByClient();
  }, []);

  const fetchSalesByClient = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/reports/sales/client');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener informe de ventas por cliente:', error);
      setError('No se pudo obtener el informe de ventas por cliente.');
    }
  };

  const fetchClientSalesDetail = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:5002/api/reports/sales/client/${clientId}`);
      setClientSales(response.data);
      setSelectedClient(clientId);
    } catch (error) {
      console.error('Error al obtener detalles de ventas del cliente:', error);
      setError('No se pudo obtener los detalles de ventas del cliente.');
    }
  };

  const exportToPDF = () => {
    if (!selectedClient) {
      alert('Selecciona un cliente para exportar sus ventas');
      return;
    }

    const doc = new jsPDF();
    doc.text(`Informe de Ventas del Cliente ${selectedClient}`, 10, 10);
    
    const tableColumn = ["ID Venta", "Fecha", "Total"];
    const tableRows = clientSales.map((sale) => [
      sale.id,
      sale.sale_date,
      sale.total,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`ventas_cliente_${selectedClient}.pdf`);
  };

  const exportToExcel = () => {
    if (!selectedClient) {
      alert('Selecciona un cliente para exportar sus ventas');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(clientSales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `VentasCliente${selectedClient}`);
    XLSX.writeFile(workbook, `ventas_cliente_${selectedClient}.xlsx`);
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
            Informe de Ventas por Cliente
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#80cbc4' }}>ID Cliente</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Nombre</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Total Gastado</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell sx={{ color: '#fff' }}>{client.id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.total_spent}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => fetchClientSalesDetail(client.id)}
                        sx={{ backgroundColor: '#4caf50' }}
                      >
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedClient && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">
                Detalle de Ventas del Cliente {selectedClient}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button variant="contained" onClick={exportToPDF} sx={{ backgroundColor: '#d32f2f' }}>
                  Exportar a PDF
                </Button>
                <Button variant="contained" onClick={exportToExcel} sx={{ backgroundColor: '#4caf50' }}>
                  Exportar a Excel
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#80cbc4' }}>ID Venta</TableCell>
                      <TableCell sx={{ color: '#80cbc4' }}>Fecha</TableCell>
                      <TableCell sx={{ color: '#80cbc4' }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell sx={{ color: '#fff' }}>{sale.id}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{sale.sale_date}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{sale.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SalesByClientReport;

