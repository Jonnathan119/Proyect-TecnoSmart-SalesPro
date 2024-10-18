const db = require('../config/db');
const excel = require('exceljs');
const PDFDocument = require('pdfkit');


exports.createSale = (req, res) => {
  const { client_id, products, is_credit } = req.body;

  console.log('Datos recibidos en el backend:', req.body);

  // Validación para que todos los datos sean insertados
  if (!client_id || !products || products.length === 0) {
    return res.status(400).json({ error: 'Cliente y productos son obligatorios' });
  }

  // Inicializar el precio total de la venta
  let total_price = 0;

  // Procesar cada producto en la venta
  products.forEach((product, index) => {
    const { product_id, quantity, price } = product;

    // Verificar que los datos del producto estén presentes
    if (!product_id || !quantity || !price) {
      return res.status(400).json({ error: 'Producto, cantidad y precio son obligatorios' });
    }

    // Calcular el total de la venta
    total_price += price * quantity;

    // Lógica para verificar inventario, registrar la venta, y actualizar el inventario
    db.query('SELECT * FROM products WHERE id = ?', [product_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al buscar producto' });
      }

      const productData = results[0];
      if (!productData || productData.quantity < quantity) {
        return res.status(400).json({ error: 'No hay suficiente inventario para el producto ' + product_id });
      }

      // Registrar la venta para cada producto
      db.query(
        'INSERT INTO sales (client_id, product_id, quantity, total_price, is_credit) VALUES (?, ?, ?, ?, ?)',
        [client_id, product_id, quantity, price * quantity, is_credit],
        (err, result) => {
          if (err) {
            console.error('Error al registrar la venta:', err);
            return res.status(500).json({ error: 'Error al registrar la venta' });
          }

          // Actualizar el inventario
          db.query(
            'UPDATE products SET quantity = quantity - ? WHERE id = ?',
            [quantity, product_id],
            (err) => {
              if (err) {
                console.error('Error al actualizar el inventario:', err);
                return res.status(500).json({ error: 'Error al actualizar el inventario' });
              }

              // Si se trata del último producto en el array, enviamos la respuesta de éxito
              if (index === products.length - 1) {
                res.status(201).json({ message: 'Venta registrada exitosamente' });
              }
            }
          );
        }
      );
    });
  });
};

// Obtener el historial de ventas
exports.getSales = (req, res) => {
  const query = `
    SELECT 
      sales.id AS sale_id, 
      sales.sale_date, 
      sales.quantity, 
      sales.total_price, 
      sales.is_credit, 
      products.name AS product_name, 
      clients.name AS client_name 
    FROM sales
    JOIN products ON sales.product_id = products.id
    JOIN clients ON sales.client_id = clients.id
    ORDER BY sales.sale_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el historial de ventas:', err);
      return res.status(500).json({ error: 'Error al obtener el historial de ventas' });
    }

    res.json(results);
  });
};

exports.getDailySalesReport = (req, res) => {
  console.log('getDailySalesReport function called');
  
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'La fecha es obligatoria para el informe diario' });
  }

  const query = `
    SELECT 
      sales.id AS sale_id, 
      clients.name AS client_name, 
      products.name AS product_name, 
      sales.quantity, 
      sales.total_price, 
      sales.sale_date 
    FROM sales
    JOIN clients ON sales.client_id = clients.id
    JOIN products ON sales.product_id = products.id
    WHERE DATE(sales.sale_date) = ?
    ORDER BY sales.sale_date DESC;
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error('Error al obtener el informe de ventas diarias:', err);
      return res.status(500).json({ error: 'Error al obtener el informe de ventas diarias' });
    }

    res.json(results);
  });
};

exports.getMonthlySalesReport = (req, res) => {
  console.log('getMonthlySalesReport function called');
  const { year, month } = req.query; 

  if (!year || !month) {
    return res.status(400).json({ error: 'El año y el mes son obligatorios para el informe mensual' });
  }

  const query = `
    SELECT 
      sales.id AS sale_id, 
      clients.name AS client_name, 
      products.name AS product_name, 
      sales.quantity, 
      sales.total_price, 
      sales.sale_date 
    FROM sales
    JOIN clients ON sales.client_id = clients.id
    JOIN products ON sales.product_id = products.id
    WHERE YEAR(sales.sale_date) = ? AND MONTH(sales.sale_date) = ?
    ORDER BY sales.sale_date DESC;
  `;

  db.query(query, [year, month], (err, results) => {
    if (err) {
      console.error('Error al obtener el informe de ventas mensuales:', err);
      return res.status(500).json({ error: 'Error al obtener el informe de ventas mensuales' });
    }

    res.json(results);
  });
};



exports.exportDailySalesToExcel = (req, res) => {
  console.log('exportDailySalesToExcel function called');
  const { date } = req.query;

  //  consulta para obtener los datos
  const query = `
    SELECT 
      sales.id AS sale_id, 
      clients.name AS client_name, 
      products.name AS product_name, 
      sales.quantity, 
      sales.total_price, 
      sales.sale_date 
    FROM sales
    JOIN clients ON sales.client_id = clients.id
    JOIN products ON sales.product_id = products.id
    WHERE DATE(sales.sale_date) = ?;
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el informe de ventas diarias' });
    }

    // Crear un nuevo libro de Excel
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Informe de Ventas Diarias');

    // Agregar encabezados
    worksheet.columns = [
      { header: 'ID Venta', key: 'sale_id', width: 10 },
      { header: 'Cliente', key: 'client_name', width: 30 },
      { header: 'Producto', key: 'product_name', width: 30 },
      { header: 'Cantidad', key: 'quantity', width: 10 },
      { header: 'Total', key: 'total_price', width: 15 },
      { header: 'Fecha', key: 'sale_date', width: 20 }
    ];

    // Agregar filas con los datos
    results.forEach(sale => {
      worksheet.addRow(sale);
    });

    // Enviar el archivo Excel como respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Informe_Ventas_Diarias_${date}.xlsx`
    );

    workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  });
};

exports.exportMonthlySalesToExcel = (req, res) => {
  console.log('exportMonthlySalesToExcel function called');
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: 'El año y el mes son obligatorios para el informe mensual' });
  }

  const query = `
    SELECT 
      sales.id AS sale_id, 
      clients.name AS client_name, 
      products.name AS product_name, 
      sales.quantity, 
      sales.total_price, 
      sales.sale_date 
    FROM sales
    JOIN clients ON sales.client_id = clients.id
    JOIN products ON sales.product_id = products.id
    WHERE YEAR(sales.sale_date) = ? AND MONTH(sales.sale_date) = ?
    ORDER BY sales.sale_date DESC;
  `;

  db.query(query, [year, month], (err, results) => {
    if (err) {
      console.error('Error al obtener el informe de ventas mensuales:', err);
      return res.status(500).json({ error: 'Error al obtener el informe de ventas mensuales' });
    }

    // Crear un nuevo libro de Excel
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Informe de Ventas Mensuales');

    // Agregar encabezados
    worksheet.columns = [
      { header: 'ID Venta', key: 'sale_id', width: 10 },
      { header: 'Cliente', key: 'client_name', width: 30 },
      { header: 'Producto', key: 'product_name', width: 30 },
      { header: 'Cantidad', key: 'quantity', width: 10 },
      { header: 'Total', key: 'total_price', width: 15 },
      { header: 'Fecha', key: 'sale_date', width: 20 }
    ];

    // Agregar filas con los datos
    results.forEach(sale => {
      worksheet.addRow(sale);
    });

    // Enviar el archivo Excel como respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Informe_Ventas_Mensuales_${year}_${month}.xlsx`
    );

    workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  });
};

exports.exportDailySalesToPDF = (req, res) => {
  console.log('exportDailySalesToPDF function called');
  const { date } = req.query;

  const query = `
    SELECT 
      sales.id AS sale_id, 
      clients.name AS client_name, 
      products.name AS product_name, 
      sales.quantity, 
      sales.total_price, 
      sales.sale_date 
    FROM sales
    JOIN clients ON sales.client_id = clients.id
    JOIN products ON sales.product_id = products.id
    WHERE DATE(sales.sale_date) = ?;
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el informe de ventas diarias' });
    }

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Informe_Ventas_Diarias_${date}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Informe de Ventas Diarias', { align: 'center' });
    doc.fontSize(12).text(`Fecha: ${date}`, { align: 'left' });

    doc.moveDown();
    results.forEach(sale => {
      doc.text(`ID Venta: ${sale.sale_id}`);
      doc.text(`Cliente: ${sale.client_name}`);
      doc.text(`Producto: ${sale.product_name}`);
      doc.text(`Cantidad: ${sale.quantity}`);
      doc.text(`Total: ${sale.total_price}`);
      doc.text(`Fecha: ${sale.sale_date}`);
      doc.moveDown();
    });

    doc.end();
  });
};

exports.exportMonthlySalesToPDF = (req, res) => {
  console.log('Exporting monthly sales to PDF...');
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: 'El año y el mes son obligatorios para el informe mensual' });
  }

  const query = `
    SELECT 
      sales.id AS sale_id, 
      clients.name AS client_name, 
      products.name AS product_name, 
      sales.quantity, 
      sales.total_price, 
      sales.sale_date 
    FROM sales
    JOIN clients ON sales.client_id = clients.id
    JOIN products ON sales.product_id = products.id
    WHERE YEAR(sales.sale_date) = ? AND MONTH(sales.sale_date) = ?
    ORDER BY sales.sale_date DESC;
  `;

  db.query(query, [year, month], (err, results) => {
    if (err) {
      console.error('Error al obtener el informe de ventas mensuales:', err);
      return res.status(500).json({ error: 'Error al obtener el informe de ventas mensuales' });
    }

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Informe_Ventas_Mensuales_${year}_${month}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Informe de Ventas Mensuales', { align: 'center' });
    doc.fontSize(12).text(`Año: ${year} - Mes: ${month}`, { align: 'left' });

    doc.moveDown();
    results.forEach(sale => {
      doc.text(`ID Venta: ${sale.sale_id}`);
      doc.text(`Cliente: ${sale.client_name}`);
      doc.text(`Producto: ${sale.product_name}`);
      doc.text(`Cantidad: ${sale.quantity}`);
      doc.text(`Total: ${sale.total_price}`);
      doc.text(`Fecha: ${sale.sale_date}`);
      doc.moveDown();
    });

    doc.end();
  });
};