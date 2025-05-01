import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './css/LoginPage.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { login, password } = Object.fromEntries(formData);
    
    try {
      const data = await loginUser(login, password);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('isAdmin', data.isAdmin);
      localStorage.setItem('userId', data.userId);
      navigate('/profile'); // Перенаправление на профиль после входа
    } catch (err) {
      setError(err.message);
      localStorage.clear(); // Очистка при ошибке
    }
  };

  return (
    <>
    <div className="non"></div>
    <div className="auth-page container mt-5">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2 className="text-center mb-4">Вход в личный кабинет</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email или телефон</label>
            <input 
              type="text" 
              name="login" 
              className="form-control" 
              placeholder="example@mail.ru или +71234567890"
              pattern="(\+7\d{10}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Пароль</label>
            <div className="input-group">
              <input 
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                placeholder="Не менее 6 символов"
                minLength="6"
                required
              />
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">
            Войти
          </button>
          
          <div className="text-center mt-4">
            <span className="text-muted">Нет аккаунта? </span>
            <a href="/register" className="text-decoration-none">Зарегистрируйтесь</a>
          </div>
        </form>
      </div>
    </div>
    
    <div className="non"></div>
    </>
  );
};

export default LoginPage;