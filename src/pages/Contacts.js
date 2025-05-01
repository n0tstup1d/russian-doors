// Contacts.js
import logo from '../assets/logo.png';
import './css/Contacts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVk, faWhatsapp, faTelegramPlane } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

export default function Contacts() {
  return (
    <>
    <div className="non"></div>
    <div className="contacts-container">
      <div className="contacts-wrapper">
        {/* Блок с логотипом и соцсетями */}
        <div className="contacts-header">
          <img src={logo} alt="Логотип" className="contacts-logo" />
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faVk} className="social-icon vk" /></a>
            <a href="#"><FontAwesomeIcon icon={faEnvelope} className="social-icon email" /></a>
            <a href="#"><FontAwesomeIcon icon={faWhatsapp} className="social-icon whatsapp" /></a>
            <a href="#"><FontAwesomeIcon icon={faTelegramPlane} className="social-icon telegram" /></a>
            <a href="#"><FontAwesomeIcon icon={faPhoneAlt} className="social-icon phone" /></a>
          </div>
        </div>

        {/* Основные контактные данные */}
        <div className="contacts-main">
          <div className="contact-block">
            <h3>Адрес:</h3>
            <p>ул. Пацаева, д. 21, стр. 1</p>
            <p>Магазин салон "Российские ДВЕРИ"</p>
          </div>

          <div className="contact-block">
            <h3>Склады:</h3>
            <p>г. Орск</p>
            <p>г. Оренбург</p>
          </div>

          <div className="contact-block">
            <h3>Телефон:</h3>
            <p>+7 967 777 44 22</p>
            <p>WatsApp, Viber, Telegram, ЯRus, Yappy</p>
          </div>
        </div>

        {/* Карта */}
        <div className="map-section">
          <h3 className="map-title">Мы находимся:</h3>
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A39abd049336778b73e11cb98efc0c4f9a8209f56fc81dd2100a001bcb9c22ac0&amp;source=constructor"
            className="map-iframe"
            allowFullScreen
          ></iframe>
        </div>

        {/* Юридическая информация */}
        <div className="legal-info">
          <p>
            Данный интернет-сайт носит исключительно информационный характер и ни при каких условиях 
            не является публичной офертой, определяемой положениями Статьи 437 Гражданского кодекса 
            Российской Федерации.
          </p>
        </div>

        {/* Дополнительные контакты */}
        <div className="additional-contacts">
          <div className="contact-group">
            <h4>Предложения по сотрудничеству:</h4>
            <p>mail@orskdveri.ru</p>
          </div>
          <div className="contact-group">
            <h4>Заказать:</h4>
            <p>Менеджер: pavel@orskdveri.ru</p>
            <p>gorin@orskdveri.ru</p>
          </div>
          <div className="contact-group">
            <h4>Техническая поддержка:</h4>
            <p>admin@orskdveri.ru</p>
          </div>
        </div>
      </div>
    </div>
   
    <div className="non"></div>
    </>
  );
}