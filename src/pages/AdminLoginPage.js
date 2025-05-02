// src/pages/AdminLoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authServices';
import './css/AdminLogin.css'; // Создайте отдельные стили

const AdminLoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    
    try {
        const data = await loginUser(email.value, password.value);
        const isAdmin = data.isAdmin;   
      if (!isAdmin) throw new Error('Доступ запрещен');
      
      navigate('/admin/dashboard'); // Перенаправление после успешного входа
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <div className="non"></div>
    <div className="admin-login-container">
      <form onSubmit={handleSubmit}>
        <h2>Вход для администратора</h2>
        {error && <div className="error-message">{error}</div>}
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Пароль" required />
        <button type="submit">Войти</button>
      </form>
    </div>
    
    <div className="non"></div>
    </>
  );
};

export default AdminLoginPage;
