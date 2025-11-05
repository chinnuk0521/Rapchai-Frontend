"use client";

import { useState, useEffect } from "react";
import { useCustomerAuth } from "../lib/customer-auth";
import { supabase } from "../../lib/supabase";
import { authModalLogger } from "../lib/logger";

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export default function CustomerAuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
}: CustomerAuthModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useCustomerAuth();

  // Log modal state changes
  useEffect(() => {
    if (isOpen) {
      authModalLogger.group('=== Auth Modal Opened ===');
      authModalLogger.table('Modal State', {
        isOpen,
        isAuthenticated,
        isLoading,
        hasError: !!error,
      });
      authModalLogger.groupEnd();
    } else {
      authModalLogger.info('Auth Modal Closed');
    }
  }, [isOpen]);

  useEffect(() => {
    authModalLogger.stateChange('isLoading', undefined, isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      authModalLogger.error('Error state set', { error });
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    const startTime = Date.now();
    authModalLogger.click('Continue with Google Button');
    authModalLogger.info('Starting Google OAuth flow');
    
    authModalLogger.stateChange('error', error, null);
    authModalLogger.stateChange('isLoading', isLoading, true);
    setError(null);
    setIsLoading(true);

    try {
      // Use window.location.origin to automatically detect current domain
      // This works for both localhost (development) and Vercel deployment (production)
      // Example: http://localhost:3000 or https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      // Explain OAuth flow in console
      console.log('%c🔄 OAuth Flow Explanation', 'color: #2196F3; font-size: 14px; font-weight: bold;');
      console.log('%c═══════════════════════════════════════════════════════════', 'color: #666;');
      console.log('%c1️⃣  User clicks "Continue with Google"', 'color: #4CAF50; font-weight: bold;');
      console.log('%c2️⃣  Frontend → Supabase (redirects to Google)', 'color: #4CAF50; font-weight: bold;');
      console.log('%c3️⃣  Google authenticates → Supabase callback:', 'color: #4CAF50; font-weight: bold;');
      console.log('   ', 'https://ukdrlbhorhsaupkskfvy.supabase.co/auth/v1/callback');
      console.log('%c4️⃣  Supabase processes → Frontend callback:', 'color: #4CAF50; font-weight: bold;');
      console.log('   ', redirectUrl);
      console.log('%c═══════════════════════════════════════════════════════════', 'color: #666;');
      console.log('%c📋 URL Configuration:', 'color: #FF9800; font-weight: bold;');
      console.log('%c   Google Cloud Console:', 'color: #666; font-weight: bold;');
      console.log('   ', 'https://ukdrlbhorhsaupkskfvy.supabase.co/auth/v1/callback');
      console.log('%c   Supabase Dashboard:', 'color: #666; font-weight: bold;');
      console.log('   ', redirectUrl);
      console.log('%c═══════════════════════════════════════════════════════════', 'color: #666;');
      
      authModalLogger.table('OAuth Configuration', {
        provider: 'google',
        redirectUrl,
        currentOrigin: window.location.origin,
        access_type: 'offline',
        prompt: 'consent',
      });

      const oauthStartTime = Date.now();
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      const oauthTime = Date.now() - oauthStartTime;
      authModalLogger.table('OAuth Initiation Result', {
        success: !signInError,
        hasData: !!data,
        hasError: !!signInError,
        error: signInError?.message || 'None',
        oauthTime: `${oauthTime}ms`,
      });

      if (signInError) {
        authModalLogger.error('Google OAuth initiation failed', signInError);
        authModalLogger.stateChange('error', null, signInError.message);
        setError(signInError.message || "Google sign in failed. Please try again.");
        authModalLogger.stateChange('isLoading', true, false);
        setIsLoading(false);
      } else {
        authModalLogger.info('OAuth flow initiated successfully, redirecting to Google');
        authModalLogger.info('Note: User will be redirected away from the page');
        // Note: If successful, the OAuth flow will redirect away from the page
        // The callback will handle the redirect back to the app
      }
    } catch (err: any) {
      const totalTime = Date.now() - startTime;
      authModalLogger.error('Exception during Google OAuth initiation', err);
      authModalLogger.table('Exception Details', {
        error: err.message || 'Unknown error',
        stack: err.stack || 'No stack trace',
        totalTime: `${totalTime}ms`,
      });
      authModalLogger.stateChange('error', null, err.message);
      setError(err.message || "An error occurred. Please try again.");
      authModalLogger.stateChange('isLoading', true, false);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    authModalLogger.click('Close Modal Button (X)');
    authModalLogger.info('Closing auth modal');
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Sign In with Google
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-[var(--rc-text-secondary)] font-medium mb-8">
              Continue with your Google account to access the customer app
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 font-semibold text-sm">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-[var(--rc-orange)] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></span>
                Redirecting...
              </span>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-xs text-[var(--rc-text-secondary)] text-center mt-6">
            By continuing, you agree to Rapchai's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

