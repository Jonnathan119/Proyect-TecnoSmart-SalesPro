import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

function ClientReport() {
  const [clients, setClients] = useState([]);
  const [clientsPurchases, setClientsPurchases] = useState([]);

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
    }
  };

  const fetchClientPurchasesReport = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/reports/clients/purchases');
      setClientsPurchases(response.data);
    } catch (error) {
      console.error('Error al obtener informe de compras por cliente:', error);
    }
  };

  // Función para exportar la lista de clientes a PDF
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

  // Función para exportar las compras de los clientes a PDF
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

  // Función para exportar la lista de clientes a Excel
  const exportClientsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

    XLSX.writeFile(workbook, 'informe_de_clientes.xlsx');
  };

  // Función para exportar las compras de los clientes a Excel
  const exportClientPurchasesToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientsPurchases);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ComprasPorCliente');

    XLSX.writeFile(workbook, 'compras_por_cliente.xlsx');
  };

  return (
    <div>
      <h2>Informe de Clientes</h2>
      <button onClick={exportClientsToPDF}>Exportar a PDF</button>
      <button onClick={exportClientsToExcel}>Exportar a Excel</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.cedula}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.address}</td>
              <td>{client.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Informe de Compras por Cliente</h2>
      <button onClick={exportClientPurchasesToPDF}>Exportar a PDF</button>
      <button onClick={exportClientPurchasesToExcel}>Exportar a Excel</button>
      <table>
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Total Gastado</th>
          </tr>
        </thead>
        <tbody>
          {clientsPurchases.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.cedula}</td>
              <td>{client.name}</td>
              <td>{client.total_spent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientReport;
