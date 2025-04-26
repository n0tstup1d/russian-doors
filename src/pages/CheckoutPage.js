import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext/CartProvider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CheckoutPage = () => {
  const { cartItems } = useContext(CartContext);
  const [deliveryType, setDeliveryType] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [installationDate, setInstallationDate] = useState(null);
  const navigate = useNavigate();

  // Проверка наличия дверей в заказе
  const hasDoors = cartItems.some(item => 
    item.product.category === "Двери"
  );

  // Отправка заказа на сервер
  const handleSubmit = async () => {
    const orderData = {
      userId: localStorage.getItem('userId'),
      items: cartItems,
      delivery: {
        type: deliveryType,
        ...(deliveryType === 'delivery' && { address, cost: calculateDeliveryCost() })
      },
      installation: hasDoors ? { date: installationDate } : null,
      total: calculateTotal()
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) navigate('/payment');
    } catch (error) {
      console.error('Ошибка оформления:', error);
    }
  };

  return (
    <div className="container my-5">
      <h2>Оформление заказа</h2>
      
      {hasDoors && (
        <div className="mb-4">
          <h4>Способ получения</h4>
          <select 
            className="form-select"
            onChange={(e) => setDeliveryType(e.target.value)}
          >
            <option value="pickup">Самовывоз</option>
            <option value="delivery">Доставка</option>
          </select>
        </div>
      )}

      {deliveryType === 'delivery' && (
        <div className="mb-4">
          <h4>Адрес доставки</h4>
          <input
            type="text"
            className="form-control"
            placeholder="Введите адрес"
            onChange={(e) => setAddress(e.target.value)}
          />
          {/* Здесь будет компонент карты */}
        </div>
      )}

      <div className="mb-4">
        <h4>Дата {deliveryType === 'delivery' ? 'доставки' : 'самовывоза'}</h4>
        <DatePicker
          selected={deliveryDate}
          onChange={(date) => setDeliveryDate(date)}
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          className="form-control"
        />
      </div>

      {hasDoors && (
        <div className="mb-4">
          <h4>Дата установки</h4>
          <DatePicker
            selected={installationDate}
            onChange={(date) => setInstallationDate(date)}
            minDate={deliveryDate || new Date()}
            dateFormat="dd/MM/yyyy"
            className="form-control"
          />
        </div>
      )}

      <button 
        className="btn btn-primary"
        onClick={handleSubmit}
      >
        Перейти к оплате
      </button>
    </div>
  );
};

export default CheckoutPage;