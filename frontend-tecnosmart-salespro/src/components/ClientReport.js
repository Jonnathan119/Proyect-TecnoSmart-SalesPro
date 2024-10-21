import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert,
} from '@mui/material';

function ClientReport() {
  const [clients, setClients] = useState([]);
  const [clientsPurchases, setClientsPurchases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClientsReport();
    fetchClientPurchasesReport();
  }, []);

  const fetchClientsReport = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/reports/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener informe de clientes:', error);
      setError('No se pudo obtener el informe de clientes.');
    }
  };

  const fetchClientPurchasesReport = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/reports/clients/purchases');
      setClientsPurchases(response.data);
    } catch (error) {
      console.error('Error al obtener informe de compras por cliente:', error);
      setError('No se pudo obtener el informe de compras por cliente.');
    }
  };

  const exportClientsToPDF = () => {
    const doc = new jsPDF();
    doc.text('Informe de Clientes', 10, 10);

    const tableColumn = ["ID", "Cédula", "Nombre", "Correo", "Teléfono", "Dirección", "Fecha de Registro"];
    const tableRows = clients.map((client) => [
      client.id,
      client.cedula,
      client.name,
      client.email,
      client.phone,
      client.address,
      client.created_at,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('informe_de_clientes.pdf');
  };

  const exportClientPurchasesToPDF = () => {
    const doc = new jsPDF();
    doc.text('Informe de Compras por Cliente', 10, 10);

    const tableColumn = ["ID Cliente", "Cédula", "Nombre", "Total Gastado"];
    const tableRows = clientsPurchases.map((client) => [
      client.id,
      client.cedula,
      client.name,
      client.total_spent,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('compras_por_cliente.pdf');
  };

  const exportClientsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    XLSX.writeFile(workbook, 'informe_de_clientes.xlsx');
  };

  const exportClientPurchasesToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientsPurchases);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ComprasPorCliente');
    XLSX.writeFile(workbook, 'compras_por_cliente.xlsx');
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
            Informe de Clientes
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="contained" onClick={exportClientsToPDF} sx={{ backgroundColor: '#d32f2f' }}>
              Exportar Clientes a PDF
            </Button>
            <Button variant="contained" onClick={exportClientsToExcel} sx={{ backgroundColor: '#4caf50' }}>
              Exportar Clientes a Excel
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#80cbc4' }}>ID</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Cédula</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Nombre</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Correo</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Teléfono</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Dirección</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Fecha de Registro</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell sx={{ color: '#fff' }}>{client.id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.cedula}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.email}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.phone}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.address}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.created_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ mt: 4 }}>
            Informe de Compras por Cliente
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="contained" onClick={exportClientPurchasesToPDF} sx={{ backgroundColor: '#d32f2f' }}>
              Exportar Compras a PDF
            </Button>
            <Button variant="contained" onClick={exportClientPurchasesToExcel} sx={{ backgroundColor: '#4caf50' }}>
              Exportar Compras a Excel
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#80cbc4' }}>ID Cliente</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Cédula</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Nombre</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Total Gastado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientsPurchases.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell sx={{ color: '#fff' }}>{client.id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.cedula}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.total_spent}</TableCell>
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

export default ClientReport;
