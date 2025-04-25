import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authServices'; // Исправлен путь
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './css/LoginPage.css'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Обновите handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    
    try {
      const data = await loginUser(email, password); // Используем полный ответ сервера
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('isAdmin', data.isAdmin);
      localStorage.setItem('userId', data.userId); // Убедись, что сервер возвращает userId
      
      // Принудительный триггер события storage
      window.dispatchEvent(new Event('storage'));
      
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <div class="non">

    </div>
    <div className="auth-page">
      <h2 className="text-center mb-4">Вход</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Пароль</label>
          <div className="input-group">
            <input 
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-control"
              required
            />
            <span 
              className="input-group-text"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Войти
        </button>
        <div className="text-center mt-3">
          <a href="/register">Зарегистрироваться</a>
        </div>
      </form>
    </div>
    <div class="non">

    </div>
    </>
  );
};

export default LoginPage;