import React from 'react';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer dark-bg">
      <div className="footer-content">
        <div className="logo-top">
            <img src={logo} alt="Логотип" />
        </div>
        {/* Социальные иконки */}
        <div className="social-icons">
          <a href="#"><i className="fab fa-vk"></i></a>
          <a href="#"><i className="fab fa-odnoklassnik"></i></a>
          <a href="#"><i className="fas fa-paper-plane"></i></a>
          <a href="#"><i className="fab fa-whatsapp"></i></a>
          <a href="#"><i className="fas fa-phone-alt"></i></a>
        </div>

        {/* Контактная информация */}
        <div className="contact-info">
          <p>ул. Пацаева, д. 21, стр. 1</p>
          <p>Магазин салон "Российские ДВЕРИ"</p>
          <p>Склады в Орске и в Оренбурге</p>
        </div>

        {/* Телефон и мессенджеры */}
        <div className="phone-messengers">
          <h2>Телефон: +7 967 777 44 22</h2>
          <p>WatsApp, Viber, Telegram, ЯRus, Yappy</p>
          <p>Instagram, OK, VK - Орск</p>
        </div>

        {/* Юридическая информация */}
        <div className="legal-info">
          <p>
            Данный интернет-сайт носит исключительно информационный характер и ни при каких условиях не является публичной офертой,
            определяемой положениями Статьи 437 Гражданского кодекса Российской Федерации.
          </p>
        </div>

        {/* Предложения и контакты */}
        <div className="offers-contact">
          <h3>Предложения по работе с нашей компанией?:</h3>
          <p>mail@orskdveri.ru</p>
          <h3>Хотите заказать?</h3>
          <p>Менеджер: pavel@orskdveri.ru,</p>
          <p>gorin@orskdveri.ru</p>
          <h3>Нашли ошибку на сайте?</h3>
          <p>Напишите админу : admin @ orskdveri . ru</p>
        </div>

        {/* Разделитель */}
        <hr />

        {/* Юридические данные */}
        <div className="legal-data">
          <p>Индивидуальный предприниматель Казарцева Валентина Павловна</p>
          <p>ОГРН 322565800080334 ОКПО 2018924079, ИНН 561500711623</p>
          <p>Факт. адрес: 462430, Оренбургская обл., г. Орск, ул. Пацаева, 21, стр. 1</p>
        </div>

        {/* Логотип и копирайт */}
        <div className="logo-copyright">
          <img src={logo} alt="Логотип" />
          <p>© Все права защищены</p>
          <a href="mailto:mail@orskdveri.ru">mail@orskdveri.ru</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;