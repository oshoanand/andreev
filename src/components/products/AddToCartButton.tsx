"use client";

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';
import { ShoppingBag } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export function AddToCartButton({ product, quantity = 1, className, variant, size, children }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <Button onClick={handleAddToCart} className={className} variant={variant} size={size}>
      {children ? children : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
