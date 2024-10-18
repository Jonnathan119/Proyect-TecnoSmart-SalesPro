import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        payment_date: paymentDate
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
    }
  };

  return (
    <div>
      <h2>Gestión de Cartera</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <h3>Informe de Cuentas por Cobrar</h3>
      <table>
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Nombre</th>
            <th>Saldo Pendiente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.client_id}>
              <td>{account.client_id}</td>
              <td>{account.name}</td>
              <td>{account.balance}</td>
              <td>
                <input
                  type="number"
                  placeholder="Monto del Pago"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Fecha de Pago"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
                <button onClick={() => handlePayment(account.client_id)}>Registrar Pago</button>
                <button onClick={() => fetchPaymentHistory(account.client_id)}>Ver Historial de Pagos</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedAccountId && (
        <div>
          <h3>Historial de Pagos para la Cuenta ID: {selectedAccountId}</h3>
          <table>
            <thead>
              <tr>
                <th>ID Pago</th>
                <th>Monto</th>
                <th>Fecha de Pago</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.payment_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AccountsReceivableManagement;
