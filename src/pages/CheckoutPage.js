import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext/CartProvider';
import { Button, Container, Alert, Form, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';
import { formatISO, parseISO, isSameDay } from 'date-fns';

const CheckoutPage = () => {
  const { cartItems, clearCart, total } = useContext(CartContext);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [selectedDate, setSelectedDate] = useState(null);
  const [busyDates, setBusyDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState('');
  const [installationRequired, setInstallationRequired] = useState(false);
  const [installationDate, setInstallationDate] = useState(null);
  const mapRef = useRef(null);
  const placemarkRef = useRef(null);
  const navigate = useNavigate();

  // Инициализация Яндекс.Карт
  useEffect(() => {
    let isMounted = true;
    let ymapsScript = null;

    const initMap = () => {
      if (!isMounted || mapRef.current) return;

      try {
        const map = new window.ymaps.Map('map', {
          center: [51.2290, 58.4681],
          zoom: 10,
          controls: ['zoomControl']
        });

        map.events.add('click', async (e) => {
          const coords = e.get('coords');
          setCoordinates(coords);

          // Удаляем предыдущий плейсмарк
          if (placemarkRef.current) {
            map.geoObjects.remove(placemarkRef.current);
          }

          // Геокодирование координат
          try {
            const response = await window.ymaps.geocode(coords);
            const firstGeoObject = response.geoObjects.get(0);
            setAddress(firstGeoObject.getAddressLine());
          } catch {
            setAddress('Адрес не определен');
          }

          // Создаем новый плейсмарк
          placemarkRef.current = new window.ymaps.Placemark(
            coords,
            { 
              hintContent: 'Точка доставки', 
              balloonContent: address || 'Доставить сюда' 
            },
            {
              preset: 'islands#redIcon',
              draggable: true
            }
          );

          map.geoObjects.add(placemarkRef.current);
          map.panTo(coords, { flying: true });
        });

        mapRef.current = map;
      } catch (err) {
        if (isMounted) setError('Ошибка инициализации карты');
      }
    };

    if (!window.ymaps) {
      ymapsScript = document.createElement('script');
      ymapsScript.src = 'https://api-maps.yandex.ru/2.1/?apikey=2dceea75-b7b1-453e-b44a-824b436d5c07&lang=ru_RU';
      ymapsScript.async = true;
      ymapsScript.onload = () => isMounted && window.ymaps.ready(initMap);
      ymapsScript.onerror = () => isMounted && setError('Не удалось загрузить карты');
      document.head.appendChild(ymapsScript);
    } else {
      window.ymaps.ready(initMap);
    }

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      if (ymapsScript) {
        document.head.removeChild(ymapsScript);
      }
    };
  }, []);

  useEffect(() => {
    const loadDeliveryDates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/deliveries.json');
        if (!response.ok) throw new Error('Ошибка загрузки дат');
        const data = await response.json();
        const parsedDates = data.deliveries.map(d => parseISO(d.date));
        setBusyDates(parsedDates);
      } catch (error) {
        setError('Не удалось загрузить даты доставки');
      } finally {
        setLoading(false);
      }
    };
    loadDeliveryDates();
  }, []);

  // Проверка доступности даты
  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    return busyDates.filter(d => isSameDay(d, date)).length < 4;
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Валидация доставки
    if (deliveryMethod === 'delivery') {
      if (!selectedDate) {
        setError('Выберите дату доставки!');
        return;
      }
      if (!coordinates || !address) {
        setError('Укажите адрес на карте!');
        return;
      }
    }

    // Валидация установки
    if (installationRequired) {
      if (!installationDate) {
        setError('Выберите дату установки!');
        return;
      }
      if (installationDate < selectedDate) {
        setError('Дата установки не может быть раньше даты доставки!');
        return;
      }
    }

    try {
      // Формирование данных заказа
      const orderData = {
        date: deliveryMethod === 'delivery' 
          ? formatISO(selectedDate, { representation: 'date' }) 
          : 'Самовывоз',
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        total: (total + (installationRequired ? 500 : 0)).toFixed(2),
        coordinates,
        address,
        status: 'Принят',
        installationRequired,
        installationDate: installationRequired 
          ? formatISO(installationDate, { representation: 'date' })
          : null,
        userId: localStorage.getItem('userId')
      };

      // Отправка заказа
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Ошибка оформления заказа');
      
      clearCart();
      navigate('/checkout-success', { state: orderData });

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">✅ Оформление заказа</h2>
      
      <Form onSubmit={handleSubmit}>
        {/* Выбор способа доставки */}
        <Form.Group className="mb-4">
          <Form.Label>Способ получения:</Form.Label>
          <div className="d-flex gap-3">
            <Form.Check
              type="radio"
              label="🚚 Доставка"
              id="delivery"
              checked={deliveryMethod === 'delivery'}
              onChange={() => setDeliveryMethod('delivery')}
            />
            <Form.Check
              type="radio"
              label="🏪 Самовывоз"
              id="pickup"
              checked={deliveryMethod === 'pickup'}
              onChange={() => setDeliveryMethod('pickup')}
            />
          </div>
        </Form.Group>

        {/* Блок доставки */}
        {deliveryMethod === 'delivery' && (
          <>
            {/* Выбор даты доставки */}
            <div className="mb-4">
              <h5>📅 Дата доставки</h5>
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <DatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  locale={ru}
                  dateFormat="dd.MM.yyyy"
                  minDate={new Date()}
                  filterDate={isDateAvailable}
                  inline
                  className="border rounded p-3"
                />
              )}
              <div className="text-muted mt-2">
                Максимум 4 доставки в день. Прошедшие даты недоступны.
              </div>
            </div>

            {/* Блок карты */}
            <div className="mb-4">
              <h5>📍 Выберите адрес на карте</h5>
              <div 
                id="map" 
                style={{ 
                  width: '100%', 
                  height: '400px', 
                  borderRadius: '8px',
                  border: '1px solid #ccc'
                }}
              />
              {address && (
                <div className="mt-2 text-muted">
                  Адрес доставки: {address}
                </div>
              )}
            </div>
          </>
        )}

        {/* Блок установки */}
        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            label="Требуется установка (+500₽)"
            checked={installationRequired}
            onChange={(e) => setInstallationRequired(e.target.checked)}
          />
        </Form.Group>

        {installationRequired && (
          <div className="mb-4">
            <h5>📅 Дата установки</h5>
            <DatePicker
              selected={installationDate}
              onChange={setInstallationDate}
              locale={ru}
              dateFormat="dd.MM.yyyy"
              minDate={selectedDate || new Date()}
              inline
              className="border rounded p-3"
            />
          </div>
        )}

        {/* Блок ошибок */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Итого */}
        <div className="mt-4 p-3 bg-light rounded">
          <h4>
            Итого к оплате: 
            <span className="text-success ms-2">
              {(total + (installationRequired ? 500 : 0)).toFixed(2)}₽
            </span>
          </h4>
        </div>

        {/* Кнопки управления */}
        <div className="d-flex justify-content-between mt-5">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(-1)}
          >
            ← Назад
          </Button>
          <Button 
            variant="success" 
            type="submit"
            disabled={loading || cartItems.length === 0}
          >
            {loading ? 'Оформляем...' : 'Подтвердить заказ'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CheckoutPage;