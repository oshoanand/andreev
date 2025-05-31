"use client";

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-headline font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to see them here.</p>
        <Button asChild size="lg">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline text-center">Your Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <Card key={item.product.id} className="overflow-hidden shadow-sm">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                    data-ai-hint="cart item product"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-semibold font-headline">{item.product.name}</h2>
                  <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  <p className="text-md font-semibold text-primary mt-1">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 my-2 sm:my-0">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-lg font-semibold w-24 text-center sm:text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
           <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={clearCart} className="text-destructive hover:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
            </Button>
          </div>
        </div>

        <Card className="lg:col-span-1 shadow-lg sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-muted-foreground">Calculated at next step</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full" onClick={() => alert('Proceeding to checkout (mock)!')}>
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
