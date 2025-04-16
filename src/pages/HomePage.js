import { useEffect } from 'react';
import Footer from '../components/FooterMain/Footer';
import Door from '../components/Doors/Door';
import logo from '../assets/logo.png';
// Исправленный путь
import './css/HomePage.css';
// Новый путь к логотипу
import action_1 from '../assets/card_action_2.png'
import action_2 from '../assets/card_action_1.png'

export default function HomePage() {
  return (
    <div className='teeest'>
      <div className='newProduct'>
          <h3>Новинка</h3>
        </div>
      <div id='home'>

        <div id='homepageid'>
          <Door name="9см смарт блэк" price={29999} />
        </div>
        <div id='brand-overlay-id'>
          <div  id='logoid'>
            <img src={logo} alt="Логотип" id='brand-logo' />
          </div>
          <div id='brand-text'>
            <h3 id='brand-word'>Российские двери</h3>
          </div>
        </div>
        <div className='newProducts'>

            <h3 >Действующие акции</h3>
            
        </div>
        
        {/* <Footer/> */}
      </div>
      <div className='newDescription' id='newesc'>
                <div className='cardsction'>
                <div className='card-item'>
                  <img src={action_1} alt="Акция 1" />
                </div>
                <div className='card-item'>
                  <img src={action_2} alt="Акция 2" />
                </div>
                </div>
        </div>
    </div>
  );
}