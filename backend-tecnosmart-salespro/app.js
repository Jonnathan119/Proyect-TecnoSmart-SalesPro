delete require.cache[require.resolve('./controllers/salesController')];
delete require.cache[require.resolve('./routes/reportRoutes')];

const express = require('express');
const cors = require('cors');  
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Habilitar CORS
app.use(cors({
  origin: 'http://localhost:3000',  // con esto solo se permiten solicitudes desde este puerto
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP permitidos
  credentials: true,  // Permitir el envío de credenciales (como cookies)
}));

// Middleware para analizar el body de las solicitudes en formato JSON
app.use(express.json());

// Rutas del backend tecnosmart_salespro
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); 
const salesRoutes = require('./routes/salesRoutes');
const clientRoutes = require('./routes/clientRoutes');
const reportRoutes = require('./routes/reportRoutes');
const accountRoutes = require('./routes/accountRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/sales', salesRoutes);  
app.use('/api/clients', clientRoutes);  
app.use('/api/reports', reportRoutes);  
app.use('/api/accounts', accountRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
