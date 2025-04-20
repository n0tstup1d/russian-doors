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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(e.target));
    
    try {
      await loginUser(email, password);
      localStorage.setItem('authToken', 'loggedIn');
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