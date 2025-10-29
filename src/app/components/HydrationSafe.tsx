"use client";
import { useEffect, useState, ReactNode } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function HydrationSafe({ children, fallback = null }: HydrationSafeProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook for hydration-safe state
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
