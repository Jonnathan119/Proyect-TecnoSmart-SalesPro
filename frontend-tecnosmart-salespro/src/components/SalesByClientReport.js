import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

function SalesByClientReport() {
  const [clients, setClients] = useState([]);
  const [clientSales, setClientSales] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchSalesByClient();
  }, []);

  const fetchSalesByClient = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/reports/sales/client');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener informe de ventas por cliente:', error);
    }
  };

  const fetchClientSalesDetail = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:5002/api/reports/sales/client/${clientId}`);
      setClientSales(response.data);
      setSelectedClient(clientId);
    } catch (error) {
      console.error('Error al obtener detalles de ventas del cliente:', error);
    }
  };

  // Función para exportar ventas por cliente a PDF
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

  // Función para exportar ventas por cliente a Excel
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
    <div>
      <h2>Informe de Ventas por Cliente</h2>
      <table>
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Nombre</th>
            <th>Total Gastado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.total_spent}</td>
              <td>
                <button onClick={() => fetchClientSalesDetail(client.id)}>Ver Detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedClient && (
        <div>
          <h3>Detalle de Ventas del Cliente {selectedClient}</h3>
          <button onClick={exportToPDF}>Exportar a PDF</button>
          <button onClick={exportToExcel}>Exportar a Excel</button>
          <table>
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {clientSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.sale_date}</td>
                  <td>{sale.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SalesByClientReport;
