//CatalogPage.js
import React, { useContext } from 'react'; // Добавьте импорт useContext
import { CartContext } from '../components/CartContext/CartProvider'; 
import DefaultCards from '../components/cards/DefaultCard';

const CatalogPage = () => {
  const { addToCart } = useContext(CartContext);
  
  // Добавьте проверку доступности контекста
  if (!addToCart) {
    console.error('CartContext is not available');
  }

  return (
    <div className="container forCatalog">
      <DefaultCards addToCart={addToCart} />
    </div>
  );
};

export default CatalogPage;