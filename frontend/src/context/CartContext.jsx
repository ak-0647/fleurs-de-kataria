import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fleurs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fleurs_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (flower) => {
    if (!flower) return;
    const fId = flower.id || flower.flower_id;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.flower_id === fId);
      if (existing) {
        return prev.map(item => 
          item.flower_id === fId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        flower_id: fId, 
        name: flower.name, 
        price: flower.price, 
        image_url: flower.image_url, 
        quantity: 1 
      }];
    });
    toast.success(`${flower.name} added!`);
  };

  const removeFromCart = (flowerId) => {
    setCartItems(prev => prev.filter(item => item.flower_id !== flowerId));
    toast.success('Item removed');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('fleurs_cart');
  };

  const updateQuantity = (flowerId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.flower_id === flowerId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const cartTotal = cartItems.reduce((total, item) => total + parseFloat(item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
