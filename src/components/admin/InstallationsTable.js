import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const InstallationsTable = () => {
  const [installations, setInstallations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/installations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        setInstallations(data.installations);
      } catch (error) {
        console.error('Ошибка загрузки установок:', error);
      }
    };
    fetchInstallations();
  }, []);

  const filteredInstallations = installations.filter(installation => {
    const matchesSearch = Object.values(installation).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesDate = filterDate 
      ? format(new Date(installation.installationDate), 'yyyy-MM-dd') === filterDate
      : true;

    return matchesSearch && matchesDate;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="installations-table-container">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Поиск по установкам..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="date-filter"
        />
        <div className="btn-group">
          <button className="btn-print" onClick={handlePrint}>
            Печать
          </button>
        </div>
      </div>

      <table className="installations-table">
        <thead>
          <tr>
            <th>Дата установки</th>
            <th>Адрес</th>
            <th>Телефон клиента</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filteredInstallations.map((installation) => (
            <tr key={installation.id}>
              <td>
                {format(new Date(installation.installationDate), 'dd MMMM yyyy', { locale: ru })}
              </td>
              <td>{installation.address}</td>
              <td>{installation.phone}</td>
              <td>
                <span className="status-badge установлено">
                  {installation.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstallationsTable;