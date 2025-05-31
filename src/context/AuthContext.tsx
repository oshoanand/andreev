
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  type User, 
  type AuthError,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<User | null>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  isAuthModalOpen?: boolean; // Optional: if you want to control a modal globally
  setIsAuthModalOpen?: Dispatch<SetStateAction<boolean>>; // Optional
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast({ title: "Account Created", description: "Welcome! Your account has been successfully created." });
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      toast({ title: "Registration Failed", description: authError.message || "Could not create account.", variant: "destructive" });
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast({ title: "Signed In", description: "Welcome back!" });
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      toast({ title: "Sign In Failed", description: authError.message || "Invalid email or password.", variant: "destructive" });
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      const authError = error as AuthError;
      toast({ title: "Sign Out Failed", description: authError.message || "Could not sign out.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password Reset Email Sent", description: "Check your inbox for password reset instructions." });
    } catch (error) {
      const authError = error as AuthError;
      toast({ title: "Password Reset Failed", description: authError.message || "Could not send reset email.", variant: "destructive" });
      throw error; // Re-throw to handle in component if needed
    }
  };

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {/* Or a loading spinner: {loading ? <GlobalSpinner /> : children} */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
