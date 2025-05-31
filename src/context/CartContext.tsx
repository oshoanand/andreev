
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

  useEffect(() => {
    const storedCart = localStorage.getItem('shopifyMiniCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shopifyMiniCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently unavailable.`,
        variant: "destructive",
      });
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        // Ensure cart quantity does not exceed stock
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
         if (newQuantity < existingItem.quantity + quantity) {
           toast({
            title: "Limited Stock",
            description: `Only ${product.stock - existingItem.quantity} more of ${product.name} can be added.`,
            variant: "default" // or "warning" if you had one
          });
        }
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      // Ensure initial quantity does not exceed stock
      const initialQuantity = Math.min(quantity, product.stock);
      if (initialQuantity < quantity) {
         toast({
            title: "Limited Stock",
            description: `Only ${product.stock} of ${product.name} available. Added ${initialQuantity} to cart.`,
            variant: "default"
          });
      }
      return [...prevItems, { product, quantity: Math.max(1, initialQuantity) }];
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
    const itemInCart = cartItems.find(item => item.product.id === productId);
    if (!itemInCart) return;

    // Ensure quantity does not go below 1
    let newQuantity = Math.max(1, quantity); 
    // Ensure quantity does not exceed stock
    newQuantity = Math.min(newQuantity, itemInCart.product.stock);

    if (quantity > itemInCart.product.stock) {
        toast({
            title: "Limited Stock",
            description: `Only ${itemInCart.product.stock} of ${itemInCart.product.name} available.`,
            variant: "default"
        });
    }
    
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
