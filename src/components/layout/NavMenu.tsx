
"use client";

import Link from 'next/link';
import { Home, ShoppingBag, User, Menu, Search, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Separator } from '../ui/separator';

const baseNavItems = [
  { href: '/', label: 'Home', icon: Home, requiresAuth: false },
];

export function NavMenu() {
  const { itemCount, setIsCartOpen } = useCart();
  const { currentUser, signOut, loading } = useAuth(); // Get currentUser and signOut
  const isMobile = useIsMobile();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    // Update search query in the input if URL changes (e.g. back/forward)
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Only update local state
  };
  
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(); // Start with fresh params for new search
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    // Navigate to homepage with the search query.
    // If already on homepage, it will re-render with the new query.
    // If on another page, it will navigate to the homepage.
    router.push(`/?${params.toString()}`);
  };
  
  const commonLinkClasses = "text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2";
  const desktopLinkClasses = `px-3 py-2 rounded-md ${commonLinkClasses}`;
  const mobileLinkClasses = `block w-full px-4 py-3 text-base ${commonLinkClasses}`;

  const SearchInputDesktop = () => (
    <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center ml-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="pl-10 h-9 rounded-lg w-48 lg:w-64 bg-muted/50 dark:bg-muted/30 focus:bg-background dark:focus:bg-card transition-colors"
      />
    </form>
  );

  const SearchInputMobile = () => (
     <form onSubmit={handleSearchSubmit} className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="pl-10 w-full h-10 rounded-lg bg-muted focus:bg-background"
          />
        </div>
      </form>
  );

  const renderNavItems = (isMobileLayout: boolean) => {
    const linkClass = isMobileLayout ? mobileLinkClasses : desktopLinkClasses;
    const items = [...baseNavItems];
    if (currentUser) {
      items.push({ href: '/profile', label: 'Profile', icon: User, requiresAuth: true });
    }

    return items.map((item) => {
      if (isMobileLayout) {
        return (
          <SheetClose asChild key={item.label}>
            <Link href={item.href} className={linkClass}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </SheetClose>
        );
      }
      return (
        <Link key={item.label} href={item.href} className={linkClass}>
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      );
    });
  };


  const AuthButtonsDesktop = () => (
    <>
      {currentUser ? (
        <Button variant="ghost" onClick={signOut} className={desktopLinkClasses}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      ) : (
        <>
          <Link href="/login" className={desktopLinkClasses}>
            <LogIn className="h-4 w-4" />
            Login
          </Link>
          <Link href="/register" className={desktopLinkClasses}>
            <UserPlus className="h-4 w-4" />
            Register
          </Link>
        </>
      )}
    </>
  );

  const AuthButtonsMobile = () => (
     <>
      {currentUser ? (
        <SheetClose asChild>
            <button onClick={signOut} className={`${mobileLinkClasses} text-left`}>
              <LogOut className="h-5 w-5" />
              Logout
            </button>
        </SheetClose>
      ) : (
        <>
          <SheetClose asChild>
            <Link href="/login" className={mobileLinkClasses}>
              <LogIn className="h-5 w-5" />
              Login
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/register" className={mobileLinkClasses}>
              <UserPlus className="h-5 w-5" />
              Register
            </Link>
          </SheetClose>
        </>
      )}
    </>
  );


  const DesktopNav = () => (
    <nav className="flex items-center">
      <SearchInputDesktop />
      <div className="flex items-center space-x-1 md:space-x-2 ml-2">
        {renderNavItems(false)}
        {!loading && <AuthButtonsDesktop />}
        <Button variant="ghost" onClick={() => setIsCartOpen(true)} className={desktopLinkClasses} aria-label={`View cart with ${itemCount} items`}>
          <ShoppingBag className="h-4 w-4" />
          ({itemCount})
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
          {renderNavItems(true)}
           <SheetClose asChild>
              <button onClick={() => { setIsCartOpen(true); }} className={`${mobileLinkClasses} text-left`}>
                  <ShoppingBag className="h-5 w-5" />
                  Cart ({itemCount})
              </button>
          </SheetClose>
          {!loading && (
            <>
              <Separator className="my-2" />
              <AuthButtonsMobile />
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
  
  if (isMobile === undefined || loading) { // Also return null if auth is loading to prevent flicker
    // You might want a skeleton loader here for better UX during initial auth check
    return (
       <div className="flex items-center space-x-1 md:space-x-2 ml-2">
        <div className="h-8 w-20 bg-muted rounded-md animate-pulse md:ml-4"></div> {/* Search skeleton */}
        <div className="h-8 w-16 bg-muted rounded-md animate-pulse"></div> {/* Nav item skeleton */}
        <div className="h-8 w-16 bg-muted rounded-md animate-pulse"></div> {/* Auth/Cart skeleton */}
      </div>
    );
  }

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
