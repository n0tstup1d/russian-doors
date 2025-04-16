import React from 'react';
import './css/DocumentsPage.css';

const DocumentsPage = () => {
  return (
    <div className="documents-page">
      <header className="page-header">
        <h1>Документы</h1>
        <p>Официальная документация компании</p>
      </header>

      <section className="document-grid">
        {/* Договор оферты */}
        <div className="document-card button-card">
          <div className="icon-wrapper">
            <i className="fas fa-file-signature"></i>
          </div>
          <div className="card-content">
            <h3>Договор оферты</h3>
            <button className="btn btn-primary">Скачать<i className="fas fa-download"></i>
            </button>
          </div>
        </div>

        {/* Карточка предприятия */}
        <div className="document-card button-card">
          <div className="icon-wrapper">
            <i className="fas fa-building"></i>
          </div>
          <div className="card-content">
            <h3>Карточка предприятия</h3>
            <button className="btn btn-primary">
              Посмотреть <i className="fas fa-eye"></i>
            </button>
          </div>
        </div>

        {/* Сертификаты */}
        <div className="document-card text-card">
          <div className="icon-wrapper">
            <i className="fas fa-certificate"></i>
          </div>
          <div className="card-content">
            <h3>Сертификаты соответствия</h3>
            <div className="certificate-list">
              <a href="#cert1" className="cert-link">Сертификат ISO 9001-2015</a>
              <a href="#cert2" className="cert-link">Сертификат пожарной безопасности</a>
              <a href="#cert3" className="cert-link">Санитарно-эпидемиологическое заключение</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocumentsPage;