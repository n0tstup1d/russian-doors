import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken } from '../../services/authServices';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(getAuthToken());

  // Синхронизация токена
  useEffect(() => {
    const handleStorageChange = () => setToken(getAuthToken());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Загрузка корзины
  useEffect(() => {
    const loadCart = async () => {
      if (token) {
        try {
          const response = await fetch('/api/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          setCartItems(data.items || []);
        } catch (error) {
          console.error('Ошибка загрузки корзины:', error);
        }
      }
    };
    loadCart();
  }, [token]);

  // Сохранение корзины
  useEffect(() => {
    const saveCart = async () => {
      if (token) {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items: cartItems })
          });
        } catch (error) {
          console.error('Ошибка сохранения:', error);
        }
      }
    };
    saveCart();
  }, [cartItems, token]);

  // Добавление в корзину
  const addToCart = (product) => {
    if (!token) {
      alert('Войдите для добавления в корзину');
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.productId === product.id && 
        item.selectedSize === product.selectedSize
      );

      if (existingItem) {
        if (existingItem.quantity + 1 > product.quantity) {
          alert('Товар закончился');
          return prev;
        }
        return prev.map(item => 
          item.productId === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { 
        productId: product.id, 
        quantity: 1,
        selectedSize: product.selectedSize,
        price: product.price
      }];
    });
  };

  // Удаление из корзины
  const removeFromCart = (productId, selectedSize) => {
    setCartItems(prev => prev.filter(item => 
      !(item.productId === productId && item.selectedSize === selectedSize)
    ));
  };

  // Изменение количества
  const incrementItem = (productId, selectedSize) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.productId === productId && item.selectedSize === selectedSize) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decrementItem = (productId, selectedSize) => {
    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId && 
        item.selectedSize === selectedSize && 
        item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

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