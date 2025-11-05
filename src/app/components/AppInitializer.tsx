"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * App Initializer - Logs initialization information to console
 * Helps debug environment, URLs, and configuration
 */
export default function AppInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    // Log app initialization info
    console.log('%c🚀 Rapchai App Initialized', 'color: #FF6B35; font-size: 16px; font-weight: bold;');
    console.log('%c═══════════════════════════════════════════════════════════', 'color: #666;');
    
    // Current URL info
    console.group('📍 Current Page Information');
    console.table({
      'Pathname': pathname,
      'Origin': window.location.origin,
      'Full URL': window.location.href,
      'Hash': window.location.hash || 'None',
      'Search': window.location.search || 'None',
    });
    console.groupEnd();

    // Environment info
    console.group('⚙️ Environment Configuration');
    console.table({
      'Environment': process.env.NODE_ENV || 'unknown',
      'API URL': process.env.NEXT_PUBLIC_API_URL || 'Not set (using /api)',
      'Supabase URL': process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set',
      'Supabase Key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set',
    });
    console.groupEnd();

    // OAuth redirect URL
    const redirectUrl = `${window.location.origin}/auth/callback`;
    console.group('🔐 OAuth Configuration');
    console.table({
      'Redirect URL': redirectUrl,
      'Current Origin': window.location.origin,
      'Is Localhost': window.location.origin.includes('localhost'),
      'Is Vercel': window.location.origin.includes('vercel.app'),
    });
    console.groupEnd();

    // Hash detection (if present)
    if (window.location.hash) {
      console.group('🔍 Hash Fragment Detected');
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get('access_token');
      const error = hashParams.get('error');
      
      console.table({
        'Hash Present': '✅ Yes',
        'Hash Length': hash.length,
        'Has Access Token': accessToken ? '✅ Yes' : '❌ No',
        'Has Error': error ? '✅ Yes' : '❌ No',
        'Current Page': pathname,
      });
      
      if (accessToken) {
        console.log('%c⚠️ OAuth hash detected on', 'color: orange; font-weight: bold;', pathname);
        console.log('%c   → Should redirect to /auth/callback', 'color: #666;');
      }
      
      if (error) {
        console.error('OAuth Error in hash:', error);
        console.error('Error Description:', hashParams.get('error_description'));
      }
      
      console.groupEnd();
    } else {
      console.log('🔍 Hash Fragment: None');
    }

    // Log helpful info
    console.log('%c═══════════════════════════════════════════════════════════', 'color: #666;');
    console.log('%c💡 Tip: Check the console for detailed logs during authentication', 'color: #4CAF50; font-style: italic;');
    console.log('%c   Logs are prefixed with [ONBOARDING], [AUTH_MODAL], [CUSTOMER_AUTH], etc.', 'color: #666; font-size: 12px;');
    console.log('%c═══════════════════════════════════════════════════════════', 'color: #666;');
  }, [pathname]);

  // Log pathname changes
  useEffect(() => {
    console.log(`📄 Page changed to: ${pathname}`);
  }, [pathname]);

  return null; // This component doesn't render anything
}

