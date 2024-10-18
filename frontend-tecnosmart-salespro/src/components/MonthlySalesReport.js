import React, { useState } from 'react';
import axios from 'axios';

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

  // Función para exportar a Excel
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

  // Función para exportar a PDF
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
    <div>
      <h2>Informe de Ventas Mensuales</h2>
      <input 
        type="number" 
        placeholder="Año" 
        value={year} 
        onChange={(e) => setYear(e.target.value)} 
        min="2000" 
        max="2100"
      />
      <input 
        type="number" 
        placeholder="Mes (1-12)" 
        value={month} 
        onChange={(e) => setMonth(e.target.value)} 
        min="1" 
        max="12"
      />
      <button onClick={fetchMonthlySales} disabled={loading}>
        {loading ? 'Cargando...' : 'Buscar'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {sales.length > 0 && (
        <div>
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

          <div>
            <button onClick={exportToExcel}>Exportar a Excel</button>
            <button onClick={exportToPDF}>Exportar a PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlySalesReport;
