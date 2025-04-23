// src/pages/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/admin/AdminPanel'; // Ваш основной компонент админки

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <button onClick={handleLogout} className="logout-btn">Выход</button>
      <AdminPanel /> {/* Ваш основной контент админки */}
    </div>
  );
};

export default AdminDashboard;