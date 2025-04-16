import { useState } from 'react';
import logo from '../../assets/logo.png';
import ListDropdown from '../listDropdown/listDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavbarHeader.css';
import Home from '../../pages/HomePage';
import { useLocation } from 'react-router-dom';

export default function NavbarHeader() {

  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown(prev => prev === menu ? null : menu);
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
            <ListDropdown to="/contacts">Контакты</ListDropdown>
            <ListDropdown to="/auth">Авторизоваться</ListDropdown>
            <ListDropdown to="/exit">Выйти</ListDropdown>
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