import { BsCart } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom'; // Раскомментировать импорт
import { useContext } from 'react';
import { CartContext } from '../CartContext/CartProvider';
import './CartButton.css'; // Исправить расширение файла стилей

const CartButton = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate(); // Инициализировать navigate

  return (
    <button 
      className="cart-button"
      onClick={() => navigate('/cart')}
    >
      <BsCart size={24} />
      <span className="cart-count">{cartItems.length}</span>
    </button>
  );
};

export default CartButton;