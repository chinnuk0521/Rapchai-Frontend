"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if there's a code in query params (PKCE flow)
        const code = searchParams.get('code');
        
        if (code) {
          // PKCE flow - exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Auth callback error:', error);
            router.push(`/onboarding?error=${encodeURIComponent(error.message || 'auth_failed')}`);
            return;
          }
          
          if (data.session) {
            // Clear query params and redirect
            window.history.replaceState({}, document.title, window.location.pathname);
            router.push('/home');
          } else {
            router.push('/onboarding?error=auth_failed');
          }
          return;
        }

        // Check if there's a hash fragment with tokens (implicit flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // If there's an error in the hash, redirect with error
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          router.push(`/onboarding?error=${encodeURIComponent(errorDescription || error)}`);
          return;
        }

        // If there's an access token in the hash, Supabase will handle it automatically
        // We just need to wait for the session to be set
        if (accessToken) {
          // Wait a moment for Supabase to process the hash
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if session was set
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            // Clear the hash from URL and redirect
            window.history.replaceState({}, document.title, window.location.pathname);
            router.push('/home');
          } else {
            // Session not set, redirect with error
            router.push('/onboarding?error=auth_failed');
          }
        } else {
          // No tokens or code, redirect to onboarding
          router.push('/onboarding?error=no_auth_data');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        router.push('/onboarding?error=auth_failed');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  // Show loading state while processing
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--rc-creamy-beige)] via-white to-[var(--rc-creamy-beige)] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rc-orange)] mx-auto mb-4"></div>
        <p className="text-[var(--rc-espresso-brown)] font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[var(--rc-creamy-beige)] via-white to-[var(--rc-creamy-beige)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rc-orange)] mx-auto mb-4"></div>
          <p className="text-[var(--rc-espresso-brown)] font-medium">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

