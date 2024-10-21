import React from 'react';
import { logout } from '../helpers/auth';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReportIcon from '@mui/icons-material/Report';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/images/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 128, 128, 0.6)', // Color verde azulado semi-transparente
        backgroundBlendMode: 'overlay',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro semitransparente para el contenido
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Bienvenido a TecnoSmart SalesPro
        </h2>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Menú Principal
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button style={buttonStyle} onClick={() => navigate('/sales')}>
            <ShoppingCartIcon style={iconStyle} />
            Gestión de Ventas
          </button>
          <button style={buttonStyle} onClick={() => navigate('/sales/history')}>
            <HistoryIcon style={iconStyle} />
            Historial de Ventas
          </button>
          <button style={buttonStyle} onClick={() => navigate('/inventory')}>
            <InventoryIcon style={iconStyle} />
            Gestión de Inventario
          </button>
          <button style={buttonStyle} onClick={() => navigate('/clients')}>
            <PeopleIcon style={iconStyle} />
            Gestión de Clientes
          </button>
          <button style={buttonStyle} onClick={() => navigate('/reports/daily')}>
            <AssessmentIcon style={iconStyle} />
            Informe de Ventas Diarias
          </button>
          <button style={buttonStyle} onClick={() => navigate('/reports/monthly')}>
            <ListAltIcon style={iconStyle} />
            Informe de Ventas Mensuales
          </button>
          <button style={buttonStyle} onClick={() => navigate('/reports/inventory')}>
            <ReportIcon style={iconStyle} />
            Informe de Inventario
          </button>
          <button style={buttonStyle} onClick={() => navigate('/reports/sales/client')}>
            <PeopleIcon style={iconStyle} />
            Ventas por Cliente
          </button>
          <button style={buttonStyle} onClick={() => navigate('/reports/clients')}>
            <ReportIcon style={iconStyle} />
            Informe de Clientes
          </button>
          <button style={buttonStyle} onClick={() => navigate('/accounts')}>
            <AccountBalanceIcon style={iconStyle} />
            Gestión de Cartera
          </button>
        </div>

        <button 
          style={{ ...buttonStyle, marginTop: '20px', backgroundColor: '#e74c3c' }}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: '#000', // Fondo negro
  color: '#fff', // Texto blanco
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.2s',
  fontSize: '16px',
};

const iconStyle = {
  fontSize: '20px',
};

export default Dashboard;
