/**
 * Cart Context for managing shopping cart state
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CartAPI, { CartItem, CartSummary } from '@/services/CartAPI';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  summary: CartSummary | null;
  itemCount: number;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (serviceId: number, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: number, quantity: number) => Promise<boolean>;
  removeItem: (itemId: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  validateCart: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh cart data
  const refreshCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await CartAPI.getCart();
      
      if (response.error) {
        setError(response.message || 'Failed to load cart');
        setItems([]);
        setSummary(null);
        setItemCount(0);
      } else if (response.data) {
        setItems(response.data.cart_items);
        setSummary(response.data.summary);
        setItemCount(response.data.summary.total_items);
      }
    } catch (err: any) {
      console.error('Error refreshing cart:', err);
      setError('Failed to load cart');
      setItems([]);
      setSummary(null);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (serviceId: number, quantity = 1): Promise<boolean> => {
    try {
      setError(null);
      
      console.log('CartContext: Adding to cart', { serviceId, quantity });

      const response = await CartAPI.addToCart({ service_id: serviceId, quantity });
      
      console.log('CartContext: Add to cart response', response);
      
      if (response.error) {
        console.error('CartContext: Add to cart failed', response.message);
        toast.error(response.message || 'Failed to add item to cart');
        return false;
      }

      toast.success('Item added to cart');
      await refreshCart();
      return true;
    } catch (err: any) {
      console.error('CartContext: Error adding to cart:', err);
      toast.error('Failed to add item to cart');
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: number, quantity: number): Promise<boolean> => {
    try {
      setError(null);

      const response = await CartAPI.updateCartItem(itemId, quantity);
      
      if (response.error) {
        toast.error(response.message || 'Failed to update item');
        return false;
      }

      await refreshCart();
      return true;
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      toast.error('Failed to update item');
      return false;
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: number): Promise<boolean> => {
    try {
      setError(null);

      const response = await CartAPI.removeFromCart(itemId);
      
      if (response.error) {
        toast.error(response.message || 'Failed to remove item');
        return false;
      }

      toast.success('Item removed from cart');
      await refreshCart();
      return true;
    } catch (err: any) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item');
      return false;
    }
  };

  // Clear entire cart
  const clearCart = async (): Promise<boolean> => {
    try {
      setError(null);

      const response = await CartAPI.clearCart();
      
      if (response.error) {
        toast.error(response.message || 'Failed to clear cart');
        return false;
      }

      toast.success('Cart cleared');
      setItems([]);
      setSummary(null);
      setItemCount(0);
      return true;
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
      return false;
    }
  };

  // Validate cart items
  const validateCart = async (): Promise<boolean> => {
    try {
      setError(null);

      const response = await CartAPI.validateCart();
      
      if (response.error) {
        setError(response.message || 'Failed to validate cart');
        return false;
      }

      if (!response.valid && response.issues) {
        // Show validation issues to user
        response.issues.forEach(issue => {
          toast.error(`${issue.service_name}: ${issue.message}`);
        });
        return false;
      }

      return true;
    } catch (err: any) {
      console.error('Error validating cart:', err);
      setError('Failed to validate cart');
      return false;
    }
  };

  // Load cart on mount and when auth state changes
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      refreshCart();
    } else {
      // Clear cart if not authenticated
      setItems([]);
      setSummary(null);
      setItemCount(0);
    }
  }, []);

  // Also refresh when auth token changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          refreshCart();
        } else {
          setItems([]);
          setSummary(null);
          setItemCount(0);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: CartContextType = {
    items,
    summary,
    itemCount,
    loading,
    error,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    validateCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};