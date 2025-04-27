import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';
import { parseISO, isSameDay } from 'date-fns';

const DeliveryCalendar = ({ selectedDate, setSelectedDate }) => {
  const [busyDates, setBusyDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const response = await fetch('/api/deliveries.json');
        const data = await response.json();
        
        // Правильное парсинг дат и подсчет
        const dateCounts = data.deliveries.reduce((acc, delivery) => {
          const date = parseISO(delivery.date);
          const dateKey = date.toISOString().split('T')[0];
          acc[dateKey] = (acc[dateKey] || 0) + 1;
          return acc;
        }, {});

        // Фильтрация только дат с 4+ доставками
        const busy = Object.entries(dateCounts)
          .filter(([_, count]) => count >= 4)
          .map(([dateStr]) => parseISO(dateStr));

        setBusyDates(busy);
      } catch (error) {
        console.error('Error loading deliveries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDeliveries();
  }, []);

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Проверка только на совпадение дня
    return date < today || 
      busyDates.some(busyDate => isSameDay(busyDate, date));
  };

  if (loading) return <div>Загрузка доступных дат...</div>;

  return (
    <div className="mb-4">
      <h4>Выберите дату доставки</h4>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        locale={ru}
        dateFormat="dd.MM.yyyy"
        minDate={new Date()}
        filterDate={date => !isDateDisabled(date)}
        inline
      />
      <div className="mt-2 text-muted">
        *Даты с 4 доставками недоступны для выбора
      </div>
    </div>
  );
};

export default DeliveryCalendar;