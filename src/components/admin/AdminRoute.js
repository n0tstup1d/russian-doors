// src/components/AdminRoute.js
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValid(res.ok);
      } catch (error) {
        setIsValid(false);
      }
    };
    if (token) verifyAdmin();
  }, [token]);

  if (isValid === null) return <div>Проверка доступа...</div>;
  return isValid ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default AdminRoute;