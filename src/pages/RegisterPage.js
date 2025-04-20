import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import policyPdf from '../assets/document/policy.pdf';
import './css/RegisterPage.css'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (data.password !== data.confirmPassword) {
      return setError('Пароли не совпадают');
    }

    if (!isPolicyAccepted) {
      return setError('Необходимо согласие на обработку персональных данных');
    }

    try {
      await registerUser(data);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <div class="non">

    </div>
    <div className="auth-page">
      <h2 className="text-center">Регистрация</h2>
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
        <div className="mb-3">
          <label>Подтверждение пароля</label>
          <div className="input-group">
            <input 
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
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

        {/* Чекбокс перенесен непосредственно перед кнопкой */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="policyCheck"
            checked={isPolicyAccepted}
            onChange={(e) => setIsPolicyAccepted(e.target.checked)}
          />
          <label htmlFor="policyCheck" className="form-check-label">
            Я согласен с <a 
  href={policyPdf} 
  target="_blank" 
  className="text"
  rel="noopener noreferrer"
>политикой конфиденциальности</a>
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Зарегистрироваться
        </button>
        <div className="text-center mt-3">
          <a href="/login">Уже есть аккаунт? Войти</a>
        </div>
      </form>
    </div>
    <div class="non">

    </div>
    </>
  );
};

export default RegisterPage;