"use client";

import { useEffect } from 'react';
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

  useEffect(() => {
    // Only process if we're not already on the callback page
    if (pathname === '/auth/callback') {
      return;
    }

    // Check if there's a hash fragment with OAuth tokens
    const hash = window.location.hash;
    if (!hash || hash.length < 10) {
      return; // No hash or too short to be OAuth data
    }

    const hashParams = new URLSearchParams(hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const error = hashParams.get('error');

    // If we have OAuth data in the hash, redirect to callback handler
    if (accessToken || error) {
      hashHandlerLogger.group('=== Hash Handler: OAuth Hash Detected ===');
      hashHandlerLogger.info('Detected OAuth hash fragments on page', {
        pathname,
        hasAccessToken: !!accessToken,
        hasError: !!error,
        hashLength: hash.length,
      });
      hashHandlerLogger.table('Hash Data', {
        pathname,
        hasAccessToken: !!accessToken,
        hasError: !!error,
        hashLength: hash.length,
      });
      hashHandlerLogger.info('Redirecting to /auth/callback for processing');
      hashHandlerLogger.navigation(pathname, '/auth/callback', 'hash-redirect');
      
      // Use window.location to preserve hash fragment during redirect
      // The callback page will process it from window.location.hash
      window.location.replace(`/auth/callback${hash}`);
      hashHandlerLogger.groupEnd();
    }
  }, [pathname, router]);

  return null; // This component doesn't render anything
}

