import React from 'react';
import { workImages } from '../components/utils/importImages';
import './css/OurWorkPage.css';

const OurWorkPage = () => {
  return (
    <div className="our-work-page">
      <header className="page-header">
        <h1>Наши работы</h1>
        <p>Примеры реализованных проектов</p>
      </header>

      <section className="gallery">
        {workImages.map((src, index) => (
          <div key={index} className="gallery-item image">
            <img src={src} alt={`Работа ${index + 1}`} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default OurWorkPage;