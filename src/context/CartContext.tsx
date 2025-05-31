
"use client";

import type { CartItem, Product } from '@/lib/types';
import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: Dispatch<SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('shopifyMiniCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopifyMiniCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity: Math.max(1, quantity) }]; // Ensure at least 1 is added
    });
    toast({
      title: "Item added to cart",
      description: `${product.name} successfully added.`,
    });
  };

  const removeFromCart = (productId: string) => {
    const removedItem = cartItems.find(item => item.product.id === productId);
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
    if (removedItem) {
        toast({
            title: "Item removed from cart",
            description: `${removedItem.product.name} removed.`,
            variant: "destructive"
        });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    // Ensure quantity does not go below 1. If it's 0 or less, it's handled by disabling the button or explicit removal.
    const newQuantity = Math.max(1, quantity); 
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
    });
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
