
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"; 
import InputMask from "react-input-mask";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Mail, Lock } from "lucide-react"; 
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  mobileNumber: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, { message: "Invalid Russian mobile number. Expected format: +7 (XXX) XXX-XX-XX" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], 
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    const user = await signUp(data.email, data.password); 
    setIsLoading(false);
    if (user) {
      router.push("/profile"); 
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold font-headline">Create an Account</CardTitle>
          <CardDescription>Join us today! Enter your details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="you@example.com" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 9 6" 
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-6 text-muted-foreground"
                          aria-hidden="true"
                        >
                          <rect width="9" height="2" y="0" fill="#fff"/>
                          <rect width="9" height="2" y="2" fill="#0039a6"/>
                          <rect width="9" height="2" y="4" fill="#d52b1e"/>
                        </svg>
                        <InputMask
                          mask="+7 (999) 999-99-99"
                          value={field.value || ''} // Controlled by react-hook-form
                          onChange={field.onChange} // react-hook-form's onChange
                          onBlur={field.onBlur}     // react-hook-form's onBlur
                          disabled={isLoading || field.disabled}
                        >
                          {(inputPropsFromMask: any) => ( // inputPropsFromMask contains value, onChange, onBlur from InputMask
                            <input
                              {...inputPropsFromMask} // Use value, onChange, onBlur from InputMask
                              name={field.name}       // Ensure RHF's name is on the input
                              ref={(node) => {
                                // Call react-input-mask's ref (from inputPropsFromMask.ref)
                                const maskRef = inputPropsFromMask.ref;
                                if (typeof maskRef === 'function') {
                                  maskRef(node);
                                } else if (maskRef && typeof maskRef === 'object' && 'current' in maskRef) {
                                  (maskRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                                }

                                // Call react-hook-form's ref (from field.ref)
                                const rhfRef = field.ref;
                                if (typeof rhfRef === 'function') {
                                  rhfRef(node);
                                } else if (rhfRef && typeof rhfRef === 'object' && 'current' in rhfRef) {
                                  (rhfRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                                }
                              }}
                              type="tel"
                              placeholder="+7 (___) ___-__-__"
                              className={cn(
                                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                "pl-12"
                              )}
                              // disabled prop is handled by <InputMask> and passed via inputPropsFromMask
                            />
                          )}
                        </InputMask>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/login">Sign in</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
