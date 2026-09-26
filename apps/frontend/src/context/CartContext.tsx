import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.js';

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  totalCount: number;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Fetch cart from backend if authenticated
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Load local guest cart from localStorage
      const guestCart = localStorage.getItem('shoppy_guest_cart');
      if (guestCart) {
        try {
          setItems(JSON.parse(guestCart));
        } catch {
          setItems([]);
        }
      } else {
        setItems([]);
      }
      return;
    }

    try {
      setIsLoading(true);
      const data = await api.cart.getCart();
      setItems(data.items || []);
    } catch (error) {
      console.warn('Failed to load user cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated) {
      // Guest cart storage
      const currentItems = [...items];
      const existing = currentItems.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        currentItems.push({
          id: `guest_${Date.now()}_${Math.random()}`,
          userId: 'guest',
          productId: product.id,
          product,
          quantity,
          createdAt: new Date().toISOString(),
        });
      }
      setItems(currentItems);
      localStorage.setItem('shoppy_guest_cart', JSON.stringify(currentItems));
      openCart();
      return;
    }

    try {
      setIsLoading(true);
      await api.cart.addToCart(product.id, quantity);
      await refreshCart();
      openCart();
    } catch (err: any) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!isAuthenticated) {
      if (quantity <= 0) {
        const next = items.filter((i) => i.id !== cartItemId);
        setItems(next);
        localStorage.setItem('shoppy_guest_cart', JSON.stringify(next));
      } else {
        const next = items.map((i) => (i.id === cartItemId ? { ...i, quantity } : i));
        setItems(next);
        localStorage.setItem('shoppy_guest_cart', JSON.stringify(next));
      }
      return;
    }

    try {
      await api.cart.updateQuantity(cartItemId, quantity);
      await refreshCart();
    } catch (err: any) {
      alert(err.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (!isAuthenticated) {
      const next = items.filter((i) => i.id !== cartItemId);
      setItems(next);
      localStorage.setItem('shoppy_guest_cart', JSON.stringify(next));
      return;
    }

    try {
      await api.cart.removeItem(cartItemId);
      await refreshCart();
    } catch (err: any) {
      alert(err.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      localStorage.removeItem('shoppy_guest_cart');
      return;
    }

    try {
      await api.cart.clearCart();
      setItems([]);
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
    }
  };

  const subtotal = Math.round(
    items.reduce((sum, item) => sum + (item.product ? item.product.price * item.quantity : 0), 0) * 100
  ) / 100;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        totalCount,
        isLoading,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
