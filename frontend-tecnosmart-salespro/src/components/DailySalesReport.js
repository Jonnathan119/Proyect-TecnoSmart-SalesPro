import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Informe de Ventas Diarias</h2>
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
      />
      <button onClick={fetchDailySales}>Buscar</button>

      <button onClick={downloadExcel} disabled={!date}>Exportar a Excel</button>
      <button onClick={downloadPDF} disabled={!date}>Exportar a PDF</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.sale_id}>
              <td>{sale.sale_id}</td>
              <td>{sale.client_name}</td>
              <td>{sale.product_name}</td>
              <td>{sale.quantity}</td>
              <td>{sale.total_price}</td>
              <td>{sale.sale_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DailySalesReport;
