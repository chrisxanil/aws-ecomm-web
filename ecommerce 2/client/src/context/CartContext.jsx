import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('nexacart_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('nexacart_cart', JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(product.stock || 99, item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: parseFloat(product.price),
          image_url: product.image_url,
          stock: product.stock,
          category_name: product.category_name,
          quantity
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(item.stock || 99, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const applyDiscount = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'NEXAAI20' || clean === 'NEURAL20') {
      setDiscountCode(clean);
      setDiscountPercent(20);
      return { success: true, message: 'Code NEXAAI20 applied! 20% discount activated.' };
    } else if (clean === 'CYBER10') {
      setDiscountCode(clean);
      setDiscountPercent(10);
      return { success: true, message: 'Code CYBER10 applied! 10% discount activated.' };
    }
    return { success: false, message: 'Invalid promo code. Try "NEXAAI20" for 20% off.' };
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = +items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const discountAmount = +(subtotal * (discountPercent / 100)).toFixed(2);
  const shipping = subtotal > 40000 || subtotal === 0 ? 0 : 499;
  const tax = +((subtotal - discountAmount) * 0.18).toFixed(2);
  const total = +(subtotal - discountAmount + shipping + tax).toFixed(2);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    totalItems,
    subtotal,
    discountCode,
    discountPercent,
    discountAmount,
    shipping,
    tax,
    total,
    applyDiscount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

