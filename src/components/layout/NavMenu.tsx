"use client";

import Link from 'next/link';
import { Home, ShoppingBag, User, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/profile', label: 'Profile', icon: User },
];

export function NavMenu() {
  const { itemCount, setIsCartOpen } = useCart();
  const isMobile = useIsMobile();

  const commonLinkClasses = "text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2";
  const desktopLinkClasses = `px-3 py-2 rounded-md ${commonLinkClasses}`;
  const mobileLinkClasses = `block w-full px-4 py-3 text-base ${commonLinkClasses}`;

  const DesktopNav = () => (
    <nav className="flex items-center space-x-2 md:space-x-4">
      {navItems.map((item) => (
        <Link key={item.label} href={item.href} className={desktopLinkClasses}>
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
      <Button variant="ghost" onClick={() => setIsCartOpen(true)} className={desktopLinkClasses}>
        <ShoppingBag className="h-4 w-4" />
        Cart ({itemCount})
      </Button>
    </nav>
  );

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs bg-background p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
             <Link href="/" className="flex items-center gap-2 text-primary">
                <ShoppingBag className="h-6 w-6" />
                <span className="text-lg font-headline font-semibold">Shopify Mini</span>
            </Link>
          </div>
          <nav className="flex-grow p-4 space-y-2">
            {navItems.map((item) => (
              <SheetClose asChild key={item.label}>
                <Link href={item.href} className={mobileLinkClasses}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </SheetClose>
            ))}
             <SheetClose asChild>
                <button onClick={() => { setIsCartOpen(true); }} className={`${mobileLinkClasses} text-left`}>
                    <ShoppingBag className="h-5 w-5" />
                    Cart ({itemCount})
                </button>
            </SheetClose>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  if (isMobile === undefined) return null; // Avoid rendering mismatch during hydration

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
