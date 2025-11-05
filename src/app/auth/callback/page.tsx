"use client";

import { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

// Comprehensive logging utility
const log = {
  info: (message: string, data?: any) => {
    console.log(`[AUTH_CALLBACK] ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[AUTH_CALLBACK] ERROR: ${message}`, error || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[AUTH_CALLBACK] WARN: ${message}`, data || '');
  },
  table: (label: string, data: any) => {
    console.log(`[AUTH_CALLBACK] ${label}:`);
    console.table(data);
  },
};

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>('Initializing...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const startTime = Date.now();
      log.info('=== Auth Callback Started ===');
      log.table('Initial State', {
        pathname: window.location.pathname,
        hash: window.location.hash ? 'Present' : 'Empty',
        search: window.location.search || 'Empty',
        fullUrl: window.location.href,
      });

      try {
        // Check if there's a code in query params (PKCE flow)
        const code = searchParams.get('code');
        log.info('Checking for code in query params', { code: code ? 'Found' : 'Not found' });
        
        if (code) {
          setStatus('Processing PKCE flow...');
          log.info('PKCE flow detected, exchanging code for session');
          
          // PKCE flow - exchange code for session
          const exchangeStart = Date.now();
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          const exchangeTime = Date.now() - exchangeStart;
          
          log.table('Code Exchange Result', {
            success: !error,
            error: error?.message || 'None',
            hasSession: !!data.session,
            exchangeTime: `${exchangeTime}ms`,
          });
          
          if (error) {
            log.error('Code exchange failed', error);
            setStatus('Authentication failed');
            router.push(`/onboarding?error=${encodeURIComponent(error.message || 'auth_failed')}`);
            return;
          }
          
          if (data.session) {
            log.info('Session created successfully', {
              userId: data.session.user?.id,
              email: data.session.user?.email,
            });
            setStatus('Session created, redirecting...');
            
            // Clear query params and redirect
            window.history.replaceState({}, document.title, window.location.pathname);
            log.info('Cleared URL params, redirecting to /home');
            router.push('/home');
          } else {
            log.warn('Code exchange succeeded but no session returned');
            setStatus('No session created');
            router.push('/onboarding?error=auth_failed');
          }
          return;
        }

        // Check if there's a hash fragment with tokens (implicit flow)
        const hash = window.location.hash.substring(1);
        log.info('Checking for hash fragments', { 
          hashLength: hash.length,
          hasHash: hash.length > 0,
        });

        if (!hash) {
          log.warn('No hash fragments or code found');
          setStatus('No authentication data found');
          router.push('/onboarding?error=no_auth_data');
          return;
        }

        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const expiresAt = hashParams.get('expires_at');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        const tokenType = hashParams.get('token_type');

        log.table('Hash Fragment Data', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasError: !!error,
          expiresAt: expiresAt || 'Not found',
          tokenType: tokenType || 'Not found',
        });

        // If there's an error in the hash, redirect with error
        if (error) {
          log.error('OAuth error in hash', { error, errorDescription });
          setStatus(`Authentication error: ${error}`);
          router.push(`/onboarding?error=${encodeURIComponent(errorDescription || error)}`);
          return;
        }

        // If there's an access token in the hash, process it
        if (accessToken) {
          setStatus('Processing hash tokens...');
          log.info('Access token found in hash, waiting for Supabase to process');
          
          // Supabase client automatically processes hash fragments on initialization
          // We need to wait for it to process and set the session
          let attempts = 0;
          const maxAttempts = 10;
          const delayMs = 500;
          
          while (attempts < maxAttempts) {
            attempts++;
            log.info(`Session check attempt ${attempts}/${maxAttempts}`);
            
            await new Promise(resolve => setTimeout(resolve, delayMs));
            
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            log.table(`Session Check ${attempts}`, {
              hasSession: !!session,
              error: sessionError?.message || 'None',
              userId: session?.user?.id || 'None',
            });
            
            if (session) {
              log.info('Session successfully set by Supabase', {
                userId: session.user?.id,
                email: session.user?.email,
                expiresAt: new Date(session.expires_at! * 1000).toISOString(),
              });
              setStatus('Session created, redirecting...');
              
              // Clear the hash from URL and redirect
              const cleanUrl = window.location.pathname + (window.location.search || '');
              window.history.replaceState({}, document.title, cleanUrl);
              log.info('Cleared hash from URL', { cleanUrl });
              
              // Small delay to ensure URL is updated
              await new Promise(resolve => setTimeout(resolve, 100));
              
              log.info('Redirecting to /home');
              router.push('/home');
              
              const totalTime = Date.now() - startTime;
              log.table('Final Result', {
                success: true,
                totalTime: `${totalTime}ms`,
                attempts: attempts,
              });
              return;
            }
            
            if (sessionError) {
              log.error('Error getting session', sessionError);
              break;
            }
          }
          
          // If we get here, session was not set after max attempts
          log.error('Session not set after max attempts', {
            attempts,
            maxAttempts,
          });
          setStatus('Session creation timeout');
          
          // Try to manually set the session using the tokens from hash
          log.info('Attempting manual session setup');
          try {
            const { data: manualSession, error: manualError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (manualSession.session) {
              log.info('Manual session setup successful');
              window.history.replaceState({}, document.title, window.location.pathname);
              router.push('/home');
              return;
            } else {
              log.error('Manual session setup failed', manualError);
            }
          } catch (manualErr) {
            log.error('Manual session setup exception', manualErr);
          }
          
          router.push('/onboarding?error=session_timeout');
        } else {
          log.warn('Hash present but no access token found');
          setStatus('Invalid authentication data');
          router.push('/onboarding?error=invalid_auth_data');
        }
      } catch (err) {
        log.error('Unhandled exception in auth callback', err);
        setStatus('Unexpected error occurred');
        router.push('/onboarding?error=auth_failed');
      } finally {
        const totalTime = Date.now() - startTime;
        log.info(`=== Auth Callback Completed (${totalTime}ms) ===`);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  // Show loading state while processing
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--rc-creamy-beige)] via-white to-[var(--rc-creamy-beige)] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rc-orange)] mx-auto mb-4"></div>
        <p className="text-[var(--rc-espresso-brown)] font-medium mb-2">Completing sign in...</p>
        <p className="text-sm text-[var(--rc-text-secondary)]">{status}</p>
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

