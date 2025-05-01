// src/components/Admin/AdminRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const isAdmin = localStorage.getItem('isAdmin') === '1';
  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default AdminRoute;