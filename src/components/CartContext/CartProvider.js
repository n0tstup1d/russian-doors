import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken } from '../../services/authServices';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const token = getAuthToken();

  // Методы корзины
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      const availableQuantity = product.quantity;
  
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > availableQuantity) {
          alert('Превышено доступное количество');
          return prev;
        }
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      }
      
      if (1 > availableQuantity) {
        alert('Товара нет в наличии');
        return prev;
      }
      
      return [...prev, { productId: product.id, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const incrementItem = (productId) => {
    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };

  const decrementItem = (productId) => {
    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity: Math.max(1, item.quantity - 1) } 
          : item
      )
    );
  };

  // Эффекты загрузки/сохранения корзины
  useEffect(() => {
    const loadCart = async () => {
      if (token) {
        try {
          const response = await fetch('/api/cart', { headers: { 'Authorization': `Bearer ${token}` } });
          const data = await response.json();
          setCartItems(data.items || []);
        } catch (error) {
          console.error('Ошибка загрузки корзины:', error);
        }
      } else {
        const localCart = localStorage.getItem('guestCart');
        setCartItems(localCart ? JSON.parse(localCart) : []);
      }
    };
    loadCart();
  }, [token]);

  useEffect(() => {
    const saveCart = async () => {
      try {
        if (token) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items: cartItems })
          });
        } else {
          localStorage.setItem('guestCart', JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error('Ошибка сохранения корзины:', error);
      }
    };
    saveCart();
  }, [cartItems, token]);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems,
        addToCart,
        removeFromCart,
        incrementItem,
        decrementItem 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};