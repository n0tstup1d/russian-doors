import React, { useContext } from 'react';
import { CartContext } from '../components/CartContext/CartProvider';
import DefaultCards from '../components/cards/DefaultCard';
import CartButton from '../components/CartButtons/CartButton';

const CatalogPage = () => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="container forCatalog">
      <DefaultCards addToCart={addToCart} />
      <CartButton />
    </div>
  );
};

export default CatalogPage;