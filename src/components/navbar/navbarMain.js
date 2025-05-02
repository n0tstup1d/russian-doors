import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import ListDropdown from '../listDropdown/listDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavbarHeader.css';
import Home from '../../pages/HomePage';
import { useLocation } from 'react-router-dom';

export default function NavbarHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown(prev => prev === menu ? null : menu);
  };

  const isAuthenticated = !!localStorage.getItem('authToken');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const response = await fetch('http://localhost:5000/api/user/check-admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Ошибка проверки прав:', error);
      }
    };

    if (isAuthenticated) checkAdminStatus();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAdmin(false); // Сброс статуса при выходе
    navigate('/login');
  };
  
  
  


  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container-fluid">
        <a className="navbar-brand brand-text" href="#">
          <img src={logo} alt="Логотип" height="35" className="me-2 logo-spin" />
          Российские ДВЕРИ<span className="dot">®</span>
        </a>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation">
            <span className="hamburger-icon" />
          </button>

         <div className={`navbar-collapse collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav">
            <ListDropdown to="/">Главная</ListDropdown>
            <ListDropdown to="/catalog">Каталог</ListDropdown>
            <ListDropdown to="/work">Наши работы</ListDropdown>
            <ListDropdown to="/documents">Документы</ListDropdown>
            {/* <ListDropdown to="/delivery">Доставка</ListDropdown>
            <ListDropdown to="/installing">Установка</ListDropdown> */}
            <ListDropdown to="/returnProduct">Возврат</ListDropdown>
            <ListDropdown to="/orders">Заказы</ListDropdown>
            <ListDropdown to="/contacts">Контакты</ListDropdown>
            {/* <ListDropdown to="/auth">Авторизоваться</ListDropdown>
            <ListDropdown to="/exit">Выйти</ListDropdown> */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <ListDropdown to="/admin/dashboard">Админ панель</ListDropdown>
                )}
                <ListDropdown to="/profile">Профиль</ListDropdown>
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link text-white"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <>
                <ListDropdown to="/login">Вход</ListDropdown>
                <ListDropdown to="/register">Регистрация</ListDropdown>
              </>
            )}
            
          </ul>
          <div className="search-wrapper">
            <input
              className="form-control search-input"
              type="search"
              placeholder="Поиск..."
            />
            <button className="btn btn-search">
              🔍
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}