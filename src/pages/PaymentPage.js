import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext/CartProvider';

const PaymentPage = () => {
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      // Здесь будет интеграция с платежной системой
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Ошибка оплаты:', error);
    }
  };

  return (
    <div className="container my-5">
      <h2>Оплата заказа</h2>
      <button 
        className="btn btn-success"
        onClick={handlePayment}
      >
        Подтвердить оплату
      </button>
    </div>
  );
};

export default PaymentPage;