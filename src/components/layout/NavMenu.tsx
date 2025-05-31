
"use client";

import Link from 'next/link';
import { Home, ShoppingBag, User, Menu, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/profile', label: 'Profile', icon: User },
];

export function NavMenu() {
  const { itemCount, setIsCartOpen } = useCart();
  const isMobile = useIsMobile();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    // Sync searchQuery with URL if it changes from outside (e.g. browser back/forward)
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);

    const params = new URLSearchParams(searchParams.toString());
    if (newQuery.trim()) {
      params.set('q', newQuery.trim());
    } else {
      params.delete('q');
    }
    // Always navigate to home page with search query, using replace to avoid excessive history
    router.replace(`/?${params.toString()}`);
  };
  
  const commonLinkClasses = "text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2";
  const desktopLinkClasses = `px-3 py-2 rounded-md ${commonLinkClasses}`;
  const mobileLinkClasses = `block w-full px-4 py-3 text-base ${commonLinkClasses}`;

  const SearchInputDesktop = () => (
    <div className="relative hidden md:flex items-center ml-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-10 h-9 rounded-lg w-48 lg:w-64 bg-muted/50 dark:bg-muted/30 focus:bg-background dark:focus:bg-card transition-colors"
      />
    </div>
  );

  const SearchInputMobile = () => (
     <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full h-10 rounded-lg bg-muted focus:bg-background"
          />
        </div>
      </div>
  );

  const DesktopNav = () => (
    <nav className="flex items-center">
      <SearchInputDesktop />
      <div className="flex items-center space-x-1 md:space-x-2 ml-2">
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
      </div>
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
      <SheetContent side="left" className="w-full max-w-xs bg-background p-0 flex flex-col">
        <div className="p-4 border-b border-border">
           <Link href="/" className="flex items-center gap-2 text-primary">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-lg font-headline font-semibold">Shopify Mini</span>
          </Link>
        </div>
        <SearchInputMobile />
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
      </SheetContent>
    </Sheet>
  );
  
  if (isMobile === undefined) return null;

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
