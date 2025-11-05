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
      hashHandlerLogger.debug('Checking for hash fragments', {
        pathname,
        hasHash: !!hash,
        hashLength: hash?.length || 0,
      });

      if (!hash || hash.length < 10) {
        return; // No hash or too short to be OAuth data
      }

      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const error = hashParams.get('error');

      // If we have OAuth data in the hash, redirect to callback handler
      if (accessToken || error) {
        // Prevent multiple redirects
        if (hasProcessedRef.current) {
          hashHandlerLogger.warn('Hash already processed, skipping redirect');
          return;
        }

        hasProcessedRef.current = true;
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
        hashHandlerLogger.info('Redirecting to /auth/callback for processing');
        hashHandlerLogger.navigation(pathname, '/auth/callback', 'hash-redirect');
        
        // Use window.location.replace to preserve hash fragment during redirect
        // This ensures the hash is preserved when redirecting to /auth/callback
        const redirectUrl = `/auth/callback${hash}`;
        hashHandlerLogger.info('Executing redirect', { redirectUrl });
        
        // Redirect immediately (no delay needed)
        window.location.replace(redirectUrl);
        
        hashHandlerLogger.groupEnd();
      }
    };

    // Check immediately on mount
    hashHandlerLogger.info('Hash handler mounted, checking for hash fragments', { pathname });
    checkAndHandleHash();

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

