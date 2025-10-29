"use client";
import { useEffect, useState, ReactNode } from 'react';

interface HydrationBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// More robust hydration boundary that handles browser extensions
export function HydrationBoundary({ children, fallback = null }: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as hydrated and client-side
    setIsHydrated(true);
    setIsClient(true);
    
    // Clean up browser extension attributes that cause hydration mismatches
    const body = document.body;
    
    // Remove Grammarly attributes
    body.removeAttribute('data-new-gr-c-s-check-loaded');
    body.removeAttribute('data-gr-ext-installed');
    body.removeAttribute('data-grammarly-shadow-root');
    body.removeAttribute('data-gramm');
    
    // Remove other common browser extension attributes
    body.removeAttribute('data-lastpass-icon-root');
    body.removeAttribute('data-lastpass-root');
    body.removeAttribute('data-1password');
    body.removeAttribute('data-bitwarden-watching');
    body.removeAttribute('data-dashlane');
    body.removeAttribute('data-adblock');
    body.removeAttribute('data-ublock');
    body.removeAttribute('data-ghostery');
    
  }, []);

  // Don't render children until hydrated to prevent mismatches
  if (!isHydrated || !isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook for checking if we're on the client side
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
