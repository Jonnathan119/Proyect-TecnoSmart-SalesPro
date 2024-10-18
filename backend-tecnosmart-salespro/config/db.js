const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '.Betancur25121.',
  database: 'tecnosmart_salesproapp'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conexión exitosa a la base de datos');
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
