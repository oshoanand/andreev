
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { mockOrders } from '@/lib/mock-data'; // Order data remains mock for now
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Package, Mail, MapPin, UserCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

function getInitials(name: string = "User") { // Default to "User" if name is not available
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
}

export default function ProfilePage() {
  const { currentUser, loading, signOut } = useAuth();
  const router = useRouter();
  const orders: Order[] = mockOrders; // In a real app, fetch this based on currentUser.uid

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login?redirect=/profile');
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center px-4">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
        <p className="text-xl text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || "Valued Customer";

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold font-headline mb-8 text-center">My Profile</h1>
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-6 p-6">
            <Avatar className="h-24 w-24 text-3xl">
              {currentUser.photoURL ? (
                <AvatarImage src={currentUser.photoURL} alt={displayName} />
              ) : (
                <AvatarImage src="https://placehold.co/100x100.png" alt={displayName} data-ai-hint="profile avatar" />
              )}
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl font-headline">{displayName}</CardTitle>
              <CardDescription className="text-muted-foreground">Welcome back!</CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-foreground">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground italic">Shipping address not set up. (Demo)</span>
            </div>
            <Button variant="outline" className="w-full sm:w-auto mt-4" onClick={() => alert('Edit profile functionality not implemented yet.')}>
              Edit Profile (mock)
            </Button>
             <Button variant="destructive" className="w-full sm:w-auto mt-4 sm:ml-2" onClick={signOut}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold font-headline mb-6 text-center">Order History (Mock Data)</h2>
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <CardTitle className="text-xl font-headline text-primary">Order #{order.id.split('_')[1]}</CardTitle>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{order.status}</span>
                  </div>
                  <CardDescription>
                    Placed on: {format(new Date(order.orderDate), 'MMMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {order.items.map(item => (
                      <li key={item.product.id} className="flex justify-between items-center text-sm">
                        <span>{item.product.name} (x{item.quantity})</span>
                        <span className="text-muted-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator />
                  <p className="text-right font-semibold mt-3">Total: ${order.totalAmount.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">You haven't placed any orders yet.</p>
            <Button asChild className="mt-6">
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
