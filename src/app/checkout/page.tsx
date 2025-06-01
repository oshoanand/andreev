
"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Home, Package, CreditCard, DollarSign, ChevronLeft, Loader2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  addressLine1: z.string().min(5, { message: "Address line 1 is required." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State/Province is required." }),
  zipCode: z.string().min(3, { message: "Zip/Postal code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  phoneNumber: z.string().min(7, {message: "Phone number seems too short."}).optional(),
});

type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;

const paymentDetailsSchema = z.object({
  cardholderName: z.string().min(2, { message: "Cardholder name is required." }),
  cardNumber: z.string().regex(/^(?:[0-9]{4}-){3}[0-9]{4}$|^[0-9]{16}$/, { message: "Enter a valid 16-digit card number (e.g., XXXX-XXXX-XXXX-XXXX or XXXXXXXXXXXXXXXX)." }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: "Expiry date must be MM/YY." }),
  cvv: z.string().regex(/^[0-9]{3,4}$/, { message: "CVV must be 3 or 4 digits." }),
});

type PaymentDetailsFormValues = z.infer<typeof paymentDetailsSchema>;

const MOCK_SHIPPING_COST = 5.00;
const MOCK_TAX_RATE = 0.08; // 8%

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const shippingForm = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phoneNumber: '',
    },
  });

  const paymentForm = useForm<PaymentDetailsFormValues>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const shippingCost = cartTotal > 0 ? MOCK_SHIPPING_COST : 0;
  const taxAmount = cartTotal * MOCK_TAX_RATE;
  const grandTotal = cartTotal + shippingCost + taxAmount;

  const handlePlaceOrder = async () => {
    const isShippingValid = await shippingForm.trigger();
    const isPaymentValid = await paymentForm.trigger();

    if (!isShippingValid || !isPaymentValid) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    clearCart();
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. Your order is being processed.",
    });
    router.push('/');
    setIsLoading(false);
  };

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-headline font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Please add items to your cart before proceeding to checkout.</p>
        <Button asChild size="lg">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Checkout</h1>
        <Button variant="outline" asChild>
          <Link href="/cart">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Cart
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...shippingForm}>
                <form className="space-y-4">
                  <FormField
                    control={shippingForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl><Input placeholder="Apt, suite, etc." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={shippingForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl><Input placeholder="New York" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shippingForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl><Input placeholder="NY" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={shippingForm.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip / Postal Code</FormLabel>
                          <FormControl><Input placeholder="10001" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shippingForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl><Input placeholder="United States" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                    control={shippingForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Payment Details Form (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">Payment Details (Mock)</CardTitle>
              <CardDescription>This is a mock payment form. Do not enter real card details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form className="space-y-4">
                  <FormField
                    control={paymentForm.control}
                    name="cardholderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl><Input placeholder="John M. Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl><Input placeholder="XXXX-XXXX-XXXX-XXXX" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={paymentForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date (MM/YY)</FormLabel>
                          <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={paymentForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl><Input placeholder="123" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="lg:col-span-1 sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold mb-3">Items in Cart:</h3>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Image src={item.product.imageUrl} alt={item.product.name} width={40} height={40} className="rounded" data-ai-hint="cart item product thumbnail" />
                  <div>
                    <p className="font-medium">{item.product.name} (x{item.quantity})</p>
                    <p className="text-xs text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                  </div>
                </div>
                <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({(MOCK_TAX_RATE * 100).toFixed(0)}%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={isLoading || cartItems.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" /> Place Order
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
