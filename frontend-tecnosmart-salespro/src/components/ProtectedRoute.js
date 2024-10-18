import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../helpers/auth';

function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
