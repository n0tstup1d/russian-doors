import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken } from '../../services/authServices';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(getAuthToken());

  const total = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
      : item.price;
    return sum + (price || 0) * (item.quantity || 1);
  }, 0);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        setToken(e.newValue || null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
        ...product,
        productId: product.id,
        quantity: 1,
        selectedSize: product.selectedSize
      }];
    });
  };

  const removeFromCart = (productId, selectedSize) => {
    setCartItems(prev => prev.filter(item => 
      !(item.productId === productId && item.selectedSize === selectedSize)
    ));
  };

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

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart,
        incrementItem,
        decrementItem,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};