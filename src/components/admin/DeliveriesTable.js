import React, { useState, useEffect } from 'react';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { ru } from 'date-fns/locale';
import { saveAs } from 'file-saver';

const DeliveriesTable = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/deliveries', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        setDeliveries(data.deliveries);
      } catch (error) {
        console.error('Ошибка загрузки доставок:', error);
      }
    };
    fetchDeliveries();
  }, []);

  const filteredDeliveries = deliveries.filter((delivery) => {
    const searchMatch = Object.values(delivery).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deliveryDate = new Date(delivery.date);
    const now = new Date();
    switch (filterPeriod) {
      case 'week':
        return deliveryDate >= subDays(now, 7);
      case 'month':
        return deliveryDate >= subMonths(now, 1);
      case 'year':
        return deliveryDate >= subYears(now, 1);
      default:
        return true;
    }
  });

  const handleExport = () => {
    const csvData = [
      ['Дата доставки', 'Адрес', 'Телефон', 'Сумма', 'Статус'],
      ...filteredDeliveries.map((delivery) => [
        format(new Date(delivery.date), 'dd.MM.yyyy'),
        delivery.address,
        delivery.phone,
        delivery.total,
        delivery.status,
      ]),
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'deliveries_export.csv');
  };

  return (
    <div className="deliveries-table-container">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Поиск по доставкам..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="btn-group">
          <button
            className={filterPeriod === 'all' ? 'active' : ''}
            onClick={() => setFilterPeriod('all')}
          >
            Все
          </button>
          <button
            className={filterPeriod === 'year' ? 'active' : ''}
            onClick={() => setFilterPeriod('year')}
          >
            Год
          </button>
          <button
            className={filterPeriod === 'month' ? 'active' : ''}
            onClick={() => setFilterPeriod('month')}
          >
            Месяц
          </button>
          <button
            className={filterPeriod === 'week' ? 'active' : ''}
            onClick={() => setFilterPeriod('week')}
          >
            Неделя
          </button>
        </div>
        <div className="btn-group">
          <button className="btn-export" onClick={handleExport}>
            Экспорт CSV
          </button>
          <button className="btn-print" onClick={() => window.print()}>
            Печать
          </button>
        </div>
      </div>

      <table className="deliveries-table">
        <thead>
          <tr>
            <th>Дата доставки</th>
            <th>Адрес</th>
            <th>Телефон</th>
            <th>Сумма</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeliveries.map((delivery) => (
            <tr key={delivery.id}>
              <td>{format(new Date(delivery.date), 'dd MMMM yyyy', { locale: ru })}</td>
              <td>{delivery.address}</td>
              <td>{delivery.phone}</td>
              <td>{delivery.total}₽</td>
              <td>
                <span className={`status-badge ${delivery.status.toLowerCase()}`}>
                  {delivery.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveriesTable;