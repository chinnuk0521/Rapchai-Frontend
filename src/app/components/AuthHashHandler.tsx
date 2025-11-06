"use client";

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { hashHandlerLogger } from '../lib/logger';

/**
 * Global handler for OAuth hash fragments
 * Redirects hash fragments to /auth/callback for processing
 * This handles cases where Supabase redirects to root instead of /auth/callback
 */
export default function AuthHashHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Function to check and handle hash fragments
    const checkAndHandleHash = () => {
      // Only process if we're not already on the callback page
      if (pathname === '/auth/callback') {
        hashHandlerLogger.debug('Already on callback page, skipping hash check');
        return;
      }

      // Check if there's a hash fragment with OAuth tokens
      const hash = window.location.hash;
      
      // Enhanced logging
      console.log('%c🔍 Hash Check:', 'color: #2196F3; font-weight: bold;', {
        pathname,
        hasHash: !!hash,
        hashLength: hash?.length || 0,
        fullHash: hash?.substring(0, 100) + '...' || 'None',
      });
      
      hashHandlerLogger.debug('Checking for hash fragments', {
        pathname,
        hasHash: !!hash,
        hashLength: hash?.length || 0,
      });

      if (!hash || hash.length < 10) {
        console.log('%c   → No hash or hash too short, skipping', 'color: #666;');
        return; // No hash or too short to be OAuth data
      }

      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const error = hashParams.get('error');
      
      console.log('%c🔍 Hash Analysis:', 'color: #2196F3; font-weight: bold;', {
        hasAccessToken: !!accessToken,
        hasError: !!error,
        hashLength: hash.length,
      });

      // If we have OAuth data in the hash, redirect to callback handler
      if (accessToken || error) {
        // Prevent multiple redirects
        if (hasProcessedRef.current) {
          hashHandlerLogger.warn('Hash already processed, skipping redirect');
          return;
        }

        hasProcessedRef.current = true;
        
        // Visual console log
        console.log('%c🚨 OAuth Hash Detected!', 'color: #FF6B35; font-size: 16px; font-weight: bold; background: #fff3e0; padding: 10px; border-radius: 5px;');
        console.log('%c═══════════════════════════════════════════════════════════', 'color: #FF6B35;');
        
        hashHandlerLogger.group('=== Hash Handler: OAuth Hash Detected ===');
        hashHandlerLogger.info('Detected OAuth hash fragments on page', {
          pathname,
          hasAccessToken: !!accessToken,
          hasError: !!error,
          hashLength: hash.length,
          fullUrl: window.location.href,
        });
        hashHandlerLogger.table('Hash Data', {
          pathname,
          hasAccessToken: !!accessToken,
          hasError: !!error,
          hashLength: hash.length,
        });
        
        // Use window.location.replace to preserve hash fragment during redirect
        // This ensures the hash is preserved when redirecting to /auth/callback
        const redirectUrl = `/auth/callback${hash}`;
        
        console.log('%c📍 Current Page:', 'color: #2196F3; font-weight: bold;', pathname);
        console.log('%c🔄 Redirecting to:', 'color: #4CAF50; font-weight: bold;', redirectUrl);
        console.log('%c⏱️  Redirecting in 100ms...', 'color: #FF9800; font-style: italic;');
        
        hashHandlerLogger.info('Redirecting to /auth/callback for processing');
        hashHandlerLogger.navigation(pathname, '/auth/callback', 'hash-redirect');
        hashHandlerLogger.info('Executing redirect', { redirectUrl });
        
        // Small delay to ensure logs are visible
        setTimeout(() => {
          console.log('%c✅ Executing redirect now...', 'color: #4CAF50; font-weight: bold;');
          window.location.replace(redirectUrl);
        }, 100);
        
        hashHandlerLogger.groupEnd();
      }
    };

    // Check immediately on mount
    console.log('%c🔍 Hash Handler Initialized', 'color: #2196F3; font-size: 14px; font-weight: bold;');
    console.log('%c   Pathname:', 'color: #666;', pathname);
    console.log('%c   Current Hash:', 'color: #666;', window.location.hash || 'None');
    hashHandlerLogger.info('Hash handler mounted, checking for hash fragments', { pathname });
    
    // Immediate check (no delay)
    checkAndHandleHash();
    
    // Also check after a very short delay in case React hasn't fully hydrated
    setTimeout(() => {
      if (!hasProcessedRef.current) {
        console.log('%c🔍 Hash Handler: Re-checking after hydration...', 'color: #2196F3; font-size: 12px;');
        checkAndHandleHash();
      }
    }, 50);

    // Also listen for hash changes (in case hash appears after component mounts)
    const handleHashChange = () => {
      hashHandlerLogger.debug('Hash change detected', { 
        newHash: window.location.hash,
        pathname,
      });
      if (!hasProcessedRef.current) {
        checkAndHandleHash();
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Clean up listener on unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname, router]);

  return null; // This component doesn't render anything
}

