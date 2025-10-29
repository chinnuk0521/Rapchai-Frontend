"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Hydration guard - only run client-side code after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize auth state from localStorage (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;

    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    
    setIsLoading(false);
  }, [isHydrated]);

  // Handle route protection (only after hydration)
  useEffect(() => {
    if (!isHydrated || isLoading) return;

    const isAdminRoute = pathname?.startsWith('/admin');
    const isLoginRoute = pathname === '/admin/login';

    if (isAdminRoute && !isLoginRoute && !token) {
      // Redirect to login if trying to access admin routes without token
      router.push('/admin/login');
    } else if (isLoginRoute && token) {
      // Redirect to dashboard if already logged in
      router.push('/admin/dashboard');
    }
  }, [token, pathname, isLoading, router, isHydrated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', response.status, errorText);
        return false;
      }

      const data = await response.json();

      if (data.accessToken) {
        setToken(data.accessToken);
        setUser(data.user);
        
        // Store in localStorage (only after hydration)
        if (isHydrated) {
          localStorage.setItem('adminToken', data.accessToken);
          localStorage.setItem('adminUser', JSON.stringify(data.user));
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Clear localStorage (only after hydration)
    if (isHydrated) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    
    router.push('/admin/login');
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      // Test the token by making a simple API call
      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        return true;
      } else if (response.status === 401) {
        // Token is invalid, logout
        logout();
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'ADMIN',
    isAuthenticated: !!token,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
