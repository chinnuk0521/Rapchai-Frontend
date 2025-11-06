"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { customerAuthLogger } from './logger';

interface Customer {
  id: string;
  email: string;
  name?: string;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from Supabase session
  useEffect(() => {
    customerAuthLogger.group('=== Customer Auth Provider Initialized ===');
    customerAuthLogger.info('Initializing customer auth state from Supabase session');
    
    const sessionStartTime = Date.now();
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      const sessionTime = Date.now() - sessionStartTime;
      customerAuthLogger.table('Initial Session Check', {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasError: !!error,
        error: error?.message || 'None',
        sessionTime: `${sessionTime}ms`,
      });

      if (session?.user) {
        const customerData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
        };
        customerAuthLogger.info('Session found, setting customer', {
          userId: customerData.id,
          email: customerData.email,
          name: customerData.name,
        });
        customerAuthLogger.stateChange('customer', null, customerData);
        setCustomer(customerData);
      } else {
        customerAuthLogger.info('No session found, customer not authenticated');
        customerAuthLogger.stateChange('customer', customer, null);
      }
      customerAuthLogger.stateChange('isLoading', isLoading, false);
      setIsLoading(false);
    });

    // Listen for auth changes
    customerAuthLogger.info('Setting up auth state change listener');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      customerAuthLogger.group(`=== Auth State Change Event: ${event} ===`);
      customerAuthLogger.table('Auth State Change', {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id || 'None',
        email: session?.user?.email || 'None',
      });

      if (session?.user) {
        const customerData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
        };
        customerAuthLogger.info('Auth state changed: User authenticated', customerData);
        customerAuthLogger.stateChange('customer', customer, customerData);
        setCustomer(customerData);
      } else {
        customerAuthLogger.info('Auth state changed: User signed out');
        customerAuthLogger.stateChange('customer', customer, null);
        setCustomer(null);
      }
      customerAuthLogger.stateChange('isLoading', isLoading, false);
      setIsLoading(false);
      customerAuthLogger.groupEnd();
    });

    customerAuthLogger.groupEnd();

    return () => {
      customerAuthLogger.info('Unsubscribing from auth state changes');
      subscription.unsubscribe();
    };
  }, []);

  // Log customer state changes
  useEffect(() => {
    customerAuthLogger.stateChange('customer', undefined, customer);
  }, [customer]);

  useEffect(() => {
    customerAuthLogger.stateChange('isLoading', undefined, isLoading);
  }, [isLoading]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const startTime = Date.now();
    customerAuthLogger.group('=== Sign In Attempt ===');
    customerAuthLogger.info('Sign in initiated', { email: email.substring(0, 3) + '***' });
    
    try {
      const signInStartTime = Date.now();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const signInTime = Date.now() - signInStartTime;
      customerAuthLogger.table('Sign In Result', {
        success: !error,
        hasUser: !!data.user,
        hasError: !!error,
        error: error?.message || 'None',
        signInTime: `${signInTime}ms`,
      });

      if (error) {
        customerAuthLogger.error('Sign in failed', error);
        customerAuthLogger.groupEnd();
        return { success: false, error: error.message };
      }

      if (data.user) {
        const customerData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        };
        customerAuthLogger.info('Sign in successful, setting customer', {
          userId: customerData.id,
          email: customerData.email,
        });
        customerAuthLogger.stateChange('customer', customer, customerData);
        setCustomer(customerData);
      }

      const totalTime = Date.now() - startTime;
      customerAuthLogger.info(`Sign in completed successfully (${totalTime}ms)`);
      customerAuthLogger.groupEnd();
      return { success: true };
    } catch (error: any) {
      const totalTime = Date.now() - startTime;
      customerAuthLogger.error('Sign in exception', error);
      customerAuthLogger.table('Sign In Exception', {
        error: error.message || 'Unknown error',
        totalTime: `${totalTime}ms`,
      });
      customerAuthLogger.groupEnd();
      return { success: false, error: error.message || 'Sign in failed' };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const startTime = Date.now();
    customerAuthLogger.group('=== Sign Up Attempt ===');
    customerAuthLogger.info('Sign up initiated', { email: email.substring(0, 3) + '***' });
    
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      customerAuthLogger.table('Sign Up Configuration', {
        email: email.substring(0, 3) + '***',
        redirectUrl,
      });

      const signUpStartTime = Date.now();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      const signUpTime = Date.now() - signUpStartTime;
      customerAuthLogger.table('Sign Up Result', {
        success: !error,
        hasUser: !!data.user,
        hasError: !!error,
        error: error?.message || 'None',
        signUpTime: `${signUpTime}ms`,
      });

      if (error) {
        customerAuthLogger.error('Sign up failed', error);
        customerAuthLogger.groupEnd();
        return { success: false, error: error.message };
      }

      if (data.user) {
        const customerData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        };
        customerAuthLogger.info('Sign up successful, setting customer', {
          userId: customerData.id,
          email: customerData.email,
        });
        customerAuthLogger.stateChange('customer', customer, customerData);
        setCustomer(customerData);
      }

      const totalTime = Date.now() - startTime;
      customerAuthLogger.info(`Sign up completed successfully (${totalTime}ms)`);
      customerAuthLogger.groupEnd();
      return { success: true };
    } catch (error: any) {
      const totalTime = Date.now() - startTime;
      customerAuthLogger.error('Sign up exception', error);
      customerAuthLogger.table('Sign Up Exception', {
        error: error.message || 'Unknown error',
        totalTime: `${totalTime}ms`,
      });
      customerAuthLogger.groupEnd();
      return { success: false, error: error.message || 'Sign up failed' };
    }
  };

  const signOut = async (): Promise<void> => {
    const startTime = Date.now();
    customerAuthLogger.group('=== Sign Out ===');
    customerAuthLogger.info('Sign out initiated', {
      customerId: customer?.id || 'None',
      email: customer?.email || 'None',
    });

    try {
      const signOutStartTime = Date.now();
      const { error } = await supabase.auth.signOut();
      const signOutTime = Date.now() - signOutStartTime;

      customerAuthLogger.table('Sign Out Result', {
        success: !error,
        hasError: !!error,
        error: error?.message || 'None',
        signOutTime: `${signOutTime}ms`,
      });

      if (error) {
        customerAuthLogger.error('Sign out failed', error);
      } else {
        customerAuthLogger.info('Sign out successful, clearing customer state');
        customerAuthLogger.stateChange('customer', customer, null);
        setCustomer(null);
      }

      const totalTime = Date.now() - startTime;
      customerAuthLogger.info(`Sign out completed (${totalTime}ms)`);
      customerAuthLogger.groupEnd();
    } catch (error: any) {
      customerAuthLogger.error('Sign out exception', error);
      customerAuthLogger.groupEnd();
    }
  };

  const value: CustomerAuthContextType = {
    customer,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!customer,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}

