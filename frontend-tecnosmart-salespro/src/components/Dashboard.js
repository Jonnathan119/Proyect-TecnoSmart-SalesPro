import React from 'react';
import { logout } from '../helpers/auth';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Bienvenido a TecnoSmart SalesPro</h2>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Menú Principal</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
          <button onClick={() => navigate('/sales')}>Gestión de Ventas</button>
          <button onClick={() => navigate('/sales/history')}>Historial de Ventas</button>
          <button onClick={() => navigate('/inventory')}>Gestión de Inventario</button>
          <button onClick={() => navigate('/clients')}>Gestión de Clientes</button>
          <button onClick={() => navigate('/reports/daily')}>Informe de Ventas Diarias</button>
          <button onClick={() => navigate('/reports/monthly')}>Informe de Ventas Mensuales</button>
          <button onClick={() => navigate('/reports/inventory')}>Informe de Inventario</button>
          <button onClick={() => navigate('/reports/sales/client')}>Ventas por Cliente</button>
          <button onClick={() => navigate('/reports/clients')}>Informe de Clientes</button>
          <button onClick={() => navigate('/accounts')}>Gestión de Cartera</button>
        </div>
      </div>
      <button  style={{ marginTop: '20px' }}
      onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default Dashboard;
