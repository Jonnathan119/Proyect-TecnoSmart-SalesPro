import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SalesHistory() {
  const [sales, setSales] = useState([]);
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
    }
  };

  return (
    <div>
      <h2>Historial de Ventas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Venta a Crédito</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.sale_id}>
              <td>{sale.sale_id}</td>
              <td>{sale.sale_date}</td>
              <td>{sale.client_name}</td>
              <td>{sale.product_name}</td>
              <td>{sale.quantity}</td>
              <td>{sale.total_price}</td>
              <td>{sale.is_credit ? 'Sí' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesHistory;
