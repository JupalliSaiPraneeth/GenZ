import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminAuthService } from '../../services/adminAuthService';

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = adminAuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
