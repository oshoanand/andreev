
"use client";

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartSidebar() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, itemCount, isCartOpen, setIsCartOpen } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-card">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl font-headline">Your Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-foreground">Your cart is empty</p>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
            <SheetClose asChild>
              <Button asChild variant="outline">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 p-3 border border-border rounded-lg shadow-sm bg-background">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                      data-ai-hint="product image"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-md text-foreground">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-5 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6 space-y-4">
              <div className="flex justify-between text-lg font-semibold text-foreground">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <SheetClose asChild>
                <Button asChild className="w-full" size="lg">
                  <Link href="/cart">View Cart & Checkout</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
