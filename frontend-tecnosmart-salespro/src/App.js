import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InventoryManagement from './components/InventoryManagement';
import SalesManagement from './components/SalesManagement';
import ClientManagement from './components/ClientManagement';
import SalesHistory from './components/SalesHistory';
import DailySalesReport from './components/DailySalesReport';
import MonthlySalesReport from './components/MonthlySalesReport';
import InventoryReport from './components/InventoryReport';
import SalesByClientReport from './components/SalesByClientReport';
import ClientReport from './components/ClientReport';
import AccountsReceivableManagement from './components/AccountsReceivableManagement';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b',
    },
    secondary: {
      main: '#c62828',
    },
  },
});

function App() {
  return (
  <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route 
        path="/login" 
        element={
        <Login />
          } 
        />
        <Route 
        path="/register" 
        element={
        <Register />
          } 
        />
        <Route 
        path="/forgot-password" 
        element={
        <ForgotPassword />
          } 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesManagement />
            </ProtectedRoute>
          }
        />
        <Route 
        path="/sales/history" 
        element={
          <ProtectedRoute>
        <SalesHistory />
        </ProtectedRoute>
          } 
        />
        <Route 
        path="/reports/daily" 
        element={
          <ProtectedRoute>
        <DailySalesReport />
        </ProtectedRoute>
          } 
       />
        <Route 
        path="/reports/monthly" 
        element={
          <ProtectedRoute>
        <MonthlySalesReport />
        </ProtectedRoute>
          } 
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/inventory"
          element={
            <ProtectedRoute>
              <InventoryReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/sales/client"
          element={
            <ProtectedRoute>
              <SalesByClientReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/clients"
          element={
            <ProtectedRoute>
              <ClientReport />
            </ProtectedRoute>
          }
        />
        <Route
        path="/accounts"
        element={
          <ProtectedRoute>
            <AccountsReceivableManagement />
         </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
