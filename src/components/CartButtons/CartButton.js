// CartButton.js
import { useContext } from 'react';
import { CartContext } from '../CartContext/CartProvider';
import { BsCartFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import './CartButton.css';

const CartButton = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasItems = totalItems > 0;

  return (
    <button 
      className="cart-button"
      onClick={() => navigate('/cart')}
      aria-label="Корзина"
    >
      <BsCartFill 
        size={26} 
        className={hasItems ? 'cart-icon-pulse' : ''} 
      />
      {hasItems && (
        <span className="cart-count">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;