import logo from '../assets/logo.png';

export default function Contacts() {
    return (<div className="footer-content" style={{ 
        padding: '50px 0'
      }} >
        <div className="logo-top">
            <img src={logo} alt="Логотип" />
        </div>
        {/* Социальные иконки */}
        <div className="social-icons">
          <a href="#"><i className="fab fa-vk" style={{ color: '#6a0dad' }}></i></a>
          <a href="#"><i className="fas fa-paper-plane" style={{ color: '#6a0dad' }}></i></a>
          <a href="#"><i className="fab fa-whatsapp" style={{ color: '#6a0dad' }}></i></a>
          <a href="#"><i className="fas fa-phone-alt" style={{ color: '#6a0dad' }}></i></a>
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
          <p>Напишите админу : admin@orskdveri.ru</p>
        </div>

        {/* Разделитель */}
        <hr />
        
        <div class="map-container1">
          <p class="location-note"style={{ 
                fontSize: '30px'
              }} >Мы находимся:</p>
          <div class="map-container">
            <iframe 
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A39abd049336778b73e11cb98efc0c4f9a8209f56fc81dd2100a001bcb9c22ac0&amp;source=constructor"
              allowfullscreen
              className="map-iframe"
              style={{ 
                width: '100%', 
                maxWidth: '800px', 
                height: '500px', 
                margin: '50px auto',
                border: '2px solid #ccc',
                borderRadius: '8px'
              }} 
              >
            </iframe>
          </div>
        </div>
    </div>);
}