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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Handle route protection
  useEffect(() => {
    if (isLoading) return;

    const isAdminRoute = pathname?.startsWith('/admin');
    const isLoginRoute = pathname === '/admin/login';

    if (isAdminRoute && !isLoginRoute && !token) {
      // Redirect to login if trying to access admin routes without token
      router.push('/admin/login');
    } else if (isLoginRoute && token) {
      // Redirect to dashboard if already logged in
      router.push('/admin/dashboard');
    }
  }, [token, pathname, isLoading, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        setToken(data.accessToken);
        setUser(data.user);
        
        // Store in localStorage
        localStorage.setItem('adminToken', data.accessToken);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
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
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'ADMIN',
    isAuthenticated: !!token,
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
