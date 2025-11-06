"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCustomerAuth } from "../../lib/customer-auth";
import CustomerAuthModal from "../../components/CustomerAuthModal";
import { onboardingLogger } from "../../lib/logger";

export default function OnboardingPage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading } = useCustomerAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Log page mount
  useEffect(() => {
    onboardingLogger.group('=== Onboarding Page Mounted ===');
    onboardingLogger.table('Initial State', {
      isAuthenticated,
      hasCustomer: !!customer,
      isLoading,
      customerId: customer?.id || 'None',
      customerEmail: customer?.email || 'None',
      isAuthModalOpen,
    });
    onboardingLogger.groupEnd();
  }, []);

  // Log state changes
  useEffect(() => {
    onboardingLogger.stateChange('isAuthModalOpen', undefined, isAuthModalOpen);
  }, [isAuthModalOpen]);

  useEffect(() => {
    onboardingLogger.stateChange('isAuthenticated', undefined, isAuthenticated);
    onboardingLogger.stateChange('customer', undefined, customer);
    onboardingLogger.stateChange('isLoading', undefined, isLoading);
  }, [isAuthenticated, customer, isLoading]);

  const handleCustomerSelect = () => {
    onboardingLogger.click('Customer Option Button', {
      isAuthenticated,
      hasCustomer: !!customer,
      currentModalState: isAuthModalOpen,
    });

    // Check if customer is authenticated
    if (isAuthenticated && customer) {
      onboardingLogger.info('Customer already authenticated, redirecting to /home', {
        customerId: customer.id,
        customerEmail: customer.email,
      });
      // Already authenticated, go to customer app
      onboardingLogger.navigation('/onboarding', '/home', 'push');
      router.push("/home");
    } else {
      onboardingLogger.info('Customer not authenticated, opening auth modal');
      // Not authenticated, show auth modal
      setIsAuthModalOpen(true);
      onboardingLogger.stateChange('isAuthModalOpen', false, true);
    }
  };

  const handleAdminSelect = () => {
    onboardingLogger.click('Admin Option Button');
    onboardingLogger.info('Admin option selected, redirecting to admin login');
    onboardingLogger.navigation('/onboarding', '/admin/login', 'push');
    // Navigate to admin login
    router.push("/admin/login");
  };

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && customer) {
      // Only redirect if auth modal is not open (to avoid redirecting while user is signing in)
      if (!isAuthModalOpen) {
        onboardingLogger.info('Auto-redirect: Customer authenticated, redirecting to /home', {
          customerId: customer.id,
          customerEmail: customer.email,
        });
        onboardingLogger.navigation('/onboarding', '/home', 'auto-redirect');
        router.push("/home");
      } else {
        onboardingLogger.debug('Auto-redirect skipped: Auth modal is open');
      }
    }
  }, [isAuthenticated, customer, isLoading, isAuthModalOpen, router]);

  const handleAuthSuccess = () => {
    onboardingLogger.info('Auth success callback triggered');
    onboardingLogger.stateChange('isAuthModalOpen', isAuthModalOpen, false);
    setIsAuthModalOpen(false);
    // Small delay to ensure auth state is updated
    setTimeout(() => {
      onboardingLogger.info('Auth success: Redirecting to /home after delay');
      onboardingLogger.navigation('/onboarding', '/home', 'auth-success');
      router.push("/home");
    }, 100);
  };

  const handleCloseModal = () => {
    onboardingLogger.click('Close Auth Modal Button');
    onboardingLogger.stateChange('isAuthModalOpen', isAuthModalOpen, false);
    setIsAuthModalOpen(false);
  };

  const handleBackToHome = () => {
    onboardingLogger.click('Back to Home Link');
    onboardingLogger.navigation('/onboarding', '/', 'link');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--rc-creamy-beige)] via-white to-[var(--rc-creamy-beige)] flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--rc-espresso-brown)] mb-4">
            Welcome to Rapchai
          </h1>
          <p className="text-xl text-[var(--rc-text-secondary)] font-medium">
            Choose how you'd like to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Option */}
          <button
            onClick={handleCustomerSelect}
            className="group relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-2 border-[var(--rc-orange)]/20 hover:border-[var(--rc-orange)]"
          >
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-[var(--rc-espresso-brown)] mb-3">
                  Customer
                </h2>
                <p className="text-[var(--rc-text-secondary)] font-medium leading-relaxed">
                  Browse our menu, book events, and order delicious food & beverages
                </p>
              </div>
              <div className="mt-6">
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold rounded-xl group-hover:from-[var(--rc-espresso-brown)] group-hover:to-[var(--rc-orange)] transition-all">
                  Continue as Customer
                </span>
              </div>
            </div>
          </button>

          {/* Admin Option */}
          <button
            onClick={handleAdminSelect}
            className="group relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-2 border-[var(--rc-espresso-brown)]/20 hover:border-[var(--rc-espresso-brown)]"
          >
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--rc-espresso-brown)] to-[var(--rc-orange)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-[var(--rc-espresso-brown)] mb-3">
                  Admin
                </h2>
                <p className="text-[var(--rc-text-secondary)] font-medium leading-relaxed">
                  Access dashboard to manage orders, menu, events, and bookings
                </p>
              </div>
              <div className="mt-6">
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--rc-espresso-brown)] to-[var(--rc-orange)] text-white font-bold rounded-xl group-hover:from-[var(--rc-orange)] group-hover:to-[var(--rc-espresso-brown)] transition-all">
                  Continue as Admin
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Back to Landing */}
        <div className="text-center mt-8">
          <Link
            href="/"
            onClick={handleBackToHome}
            className="text-[var(--rc-text-secondary)] hover:text-[var(--rc-orange)] transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseModal}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

