import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

function InventoryReport() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [inventory, setInventory] = useState([]);

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
    }
  };

  const fetchInventoryReport = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/reports/inventory/general');
      setInventory(response.data);
    } catch (error) {
      console.error('Error al obtener el estado del inventario:', error);
    }
  };

  // Función para exportar el estado del inventario a PDF
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

  // Función para exportar el estado del inventario a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(inventory);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');

    XLSX.writeFile(workbook, 'inventario.xlsx');
  };

  return (
    <div>
      <h2>Productos con Bajo Stock</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {lowStockProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Estado General del Inventario</h2>
      <button onClick={exportToPDF}>Exportar a PDF</button>
      <button onClick={exportToExcel}>Exportar a Excel</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
              <td>{product.total_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryReport;
