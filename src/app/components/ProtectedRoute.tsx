"use client";
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
        return;
      }
      
      if (requireAdmin && !isAdmin) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--rc-creamy-beige)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rc-orange)] mx-auto mb-4"></div>
          <p className="text-[var(--rc-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  if (requireAdmin && !isAdmin) {
    return fallback || null;
  }

  return <>{children}</>;
}
