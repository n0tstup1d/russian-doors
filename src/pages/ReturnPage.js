// pages/ReturnPage.jsx
import React, { useEffect } from 'react';
import './css/ReturnPage.css';

const ReturnPage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          if (entry.target.classList.contains('connector')) {
            entry.target.querySelector('.line-dash').style.animationPlayState = 'running';
          }
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.step-card, .connector, .page-header *').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="return-page">
      <header className="page-header">
        <h1 className="title-anim">Процесс возврата товара</h1>
        <p className="subtitle-anim">Порядок действий для оформления возврата</p>
      </header>

      <div className="timeline-flow">
        {[1, 2, 3, 4].map((step, index) => (
          <React.Fragment key={step}>
            <div className="step-card">
              <div className="step-number">
                <span className="pulse-anim">{step}</span>
                <div className="step-glow"></div>
              </div>
              <div className="step-content">
                <h3>{stepTitles[step - 1]}</h3>
                <p>{stepDescriptions[step - 1]}</p>
              </div>
            </div>
            
            {index < 3 && (
              <div className="connector">
                <div className="line-dash">
                  <div className="line-flow"></div>
                </div>
                <div className="arrow-container">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="important-note">
        <i className="fas fa-exclamation-triangle"></i>
        <p>Возврат возможен только при сохранении товарного вида и полной комплектации</p>
      </div>
    </div>
  );
};

const stepTitles = [
  'Сохранение упаковки',
  'Доставка на склад',
  'Проверка товара',
  'Возврат средств'
];

const stepDescriptions = [
  'Товар должен находиться в заводской упаковке без повреждений',
  'Привезите товар в магазин "Российские ДВЕРИ" за свой счет',
  'Проверка количества и качества по сопроводительным документам',
  'Возврат средств осуществляется в течение 10 рабочих дней'
];

export default ReturnPage;