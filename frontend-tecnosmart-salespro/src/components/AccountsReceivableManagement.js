import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Alert,
} from '@mui/material';

function AccountsReceivableManagement() {
  const [accounts, setAccounts] = useState([]);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [error, setError] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  useEffect(() => {
    fetchAccountsReceivableReport();
  }, []);

  const fetchAccountsReceivableReport = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/accounts/report');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error al obtener informe de cuentas por cobrar:', error);
      setError('No se pudo obtener el informe de cuentas por cobrar.');
    }
  };

  const handlePayment = async (accountId) => {
    if (!amountPaid || !paymentDate) {
      alert('Por favor, ingrese el monto del pago y la fecha.');
      return;
    }

    try {
      await axios.post('http://localhost:5002/api/accounts/payment', {
        account_id: accountId,
        amount_paid: parseFloat(amountPaid),
        payment_date: paymentDate,
      });
      alert('Pago registrado exitosamente');
      fetchAccountsReceivableReport();
      fetchPaymentHistory(accountId);
      setAmountPaid('');
      setPaymentDate('');
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      setError('Error al registrar el pago');
    }
  };

  const fetchPaymentHistory = async (accountId) => {
    try {
      const response = await axios.get(`http://localhost:5002/api/accounts/payment/history/${accountId}`);
      setPaymentHistory(response.data);
      setSelectedAccountId(accountId);
    } catch (error) {
      console.error('Error al obtener el historial de pagos:', error);
      setError('No se pudo obtener el historial de pagos.');
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
          padding: '20px',
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Gestión de Financiamiento
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Typography variant="h6" gutterBottom>
            Informe de Cuentas por Cobrar
          </Typography>
          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#80cbc4' }}>ID Cliente</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Nombre</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Saldo Pendiente</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.client_id}>
                    <TableCell sx={{ color: '#fff' }}>{account.client_id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{account.name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{account.balance}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        placeholder="Monto del Pago"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        sx={{ backgroundColor: '#fff', borderRadius: '5px', marginRight: 1 }}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                      <TextField
                        type="date"
                        placeholder="Fecha de Pago"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        sx={{ backgroundColor: '#fff', borderRadius: '5px', marginRight: 1 }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => handlePayment(account.client_id)}
                        sx={{ backgroundColor: '#4caf50', marginRight: 1 }}
                      >
                        Registrar Pago
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => fetchPaymentHistory(account.client_id)}
                        sx={{ backgroundColor: '#1976d2' }}
                      >
                        Ver Historial de Pagos
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedAccountId && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">
                Historial de Pagos para la Cuenta ID: {selectedAccountId}
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#80cbc4' }}>ID Pago</TableCell>
                      <TableCell sx={{ color: '#80cbc4' }}>Monto</TableCell>
                      <TableCell sx={{ color: '#80cbc4' }}>Fecha de Pago</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell sx={{ color: '#fff' }}>{payment.id}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{payment.amount}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{payment.payment_date}</TableCell>
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

export default AccountsReceivableManagement;

