"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCustomerAuth } from "../lib/customer-auth";
import CustomerAuthModal from "./CustomerAuthModal";

export default function CustomerNavBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/home";
  const { customer, signOut: customerSignOut, isLoading: customerAuthLoading } = useCustomerAuth();

  // Hydration guard
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Only apply scroll behavior on home page
    // Always keep navbar visible on other pages and when mobile menu is open
    if (!isHomePage || isMobileMenuOpen) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Hide navbar when approaching footer section
      const footerThreshold = documentHeight - windowHeight - (windowHeight * 0.7);
      
      if (scrollPosition > footerThreshold) {
        setIsVisible(false);
      } else if (scrollPosition > heroHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, isHydrated, isMobileMenuOpen]);

  // Don't render until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--rc-creamy-beige)]/95 border-b-2 border-[var(--rc-orange)]/20 shadow-lg">
      <div className="w-full container-px flex h-16 items-center justify-between">
        <Link href="/home" className="flex items-center hover:opacity-80 transition-opacity" aria-label="Home">
          <img src="/logo-orange.svg" alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
          <Link href="/menu" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Menu</Link>
          <Link href="/events" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Events</Link>
          <Link href="/catering" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold hidden lg:inline">Private Dining</Link>
          <Link href="/gallery" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Gallery</Link>
          <Link href="/contact" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold hidden lg:inline">Contact</Link>
          
          {/* Customer Auth Section */}
          {!customerAuthLoading && (
            customer ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="text-xs lg:text-sm text-[var(--rc-espresso-brown)] font-semibold hidden xl:inline">
                  {customer.email?.split('@')[0] || 'User'}
                </span>
                <button
                  onClick={customerSignOut}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors text-xs"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-2 bg-[var(--rc-orange)] text-white rounded-lg font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors text-xs"
              >
                Sign In
              </button>
            )
          )}
          
          <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--rc-orange)] text-white px-4 py-2 text-xs font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors shadow-md">Order Now</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-12 h-12 flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg hover:bg-[var(--rc-creamy-beige)] transition-colors z-50 relative"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
        >
          <span className={`w-6 h-0.5 bg-[var(--rc-espresso-brown)] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[var(--rc-espresso-brown)] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[var(--rc-espresso-brown)] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--rc-creamy-beige)] border-t-2 border-[var(--rc-orange)]/20 shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="container-px py-4 space-y-2">
            <Link 
              href="/menu" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Menu
            </Link>
            <Link 
              href="/events" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Events
            </Link>
            <Link 
              href="/catering" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Private Dining
            </Link>
            <Link 
              href="/gallery" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Gallery
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Contact
            </Link>
            
            <div className="border-t border-[var(--rc-orange)]/20 pt-2 mt-2">
              {!customerAuthLoading && (
                customer ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-sm text-[var(--rc-text-secondary)]">
                      {customer.email?.split('@')[0] || 'User'}
                    </div>
                    <button
                      onClick={() => {
                        customerSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors text-base"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-[var(--rc-orange)] text-white rounded-lg font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors text-base"
                  >
                    Sign In
                  </button>
                )
              )}
              
              <a 
                href="https://wa.me/919000000000" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full mt-2 px-4 py-3 text-center rounded-lg bg-[var(--rc-orange)] text-white font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors shadow-md text-base"
              >
                Order Now
              </a>
            </div>
          </nav>
        </div>
      )}
      </header>
    );
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--rc-creamy-beige)]/95 border-b-2 border-[var(--rc-orange)]/20 shadow-lg transition-all duration-500 ${
        isVisible || isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}
    >
      <div className="w-full container-px flex h-16 items-center justify-between">
        <Link href="/home" className="flex items-center hover:opacity-80 transition-opacity" aria-label="Home">
          <img src="/logo-orange.svg" alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
          <Link href="/menu" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Menu</Link>
          <Link href="/events" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Events</Link>
          <Link href="/catering" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold hidden lg:inline">Private Dining</Link>
          <Link href="/gallery" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Gallery</Link>
          <Link href="/contact" className="px-3 py-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold hidden lg:inline">Contact</Link>
          
          {/* Customer Auth Section */}
          {!customerAuthLoading && (
            customer ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="text-xs lg:text-sm text-[var(--rc-espresso-brown)] font-semibold hidden xl:inline">
                  {customer.email?.split('@')[0] || 'User'}
                </span>
                <button
                  onClick={customerSignOut}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors text-xs"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-2 bg-[var(--rc-orange)] text-white rounded-lg font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors text-xs"
              >
                Sign In
              </button>
            )
          )}
          
          <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--rc-orange)] text-white px-4 py-2 text-xs font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors shadow-md">Order Now</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-12 h-12 flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg hover:bg-[var(--rc-creamy-beige)] transition-colors z-50 relative"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
        >
          <span className={`w-6 h-0.5 bg-[var(--rc-espresso-brown)] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[var(--rc-espresso-brown)] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[var(--rc-espresso-brown)] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--rc-creamy-beige)] border-t-2 border-[var(--rc-orange)]/20 shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="container-px py-4 space-y-2">
            <Link 
              href="/menu" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Menu
            </Link>
            <Link 
              href="/events" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Events
            </Link>
            <Link 
              href="/catering" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Private Dining
            </Link>
            <Link 
              href="/gallery" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Gallery
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-bold text-[var(--rc-espresso-brown)] hover:bg-[var(--rc-orange)]/10 hover:text-[var(--rc-orange)] rounded-lg transition-colors"
            >
              Contact
            </Link>
            
            <div className="border-t border-[var(--rc-orange)]/20 pt-2 mt-2">
              {!customerAuthLoading && (
                customer ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-sm text-[var(--rc-text-secondary)]">
                      {customer.email?.split('@')[0] || 'User'}
                    </div>
                    <button
                      onClick={() => {
                        customerSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors text-base"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-[var(--rc-orange)] text-white rounded-lg font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors text-base"
                  >
                    Sign In
                  </button>
                )
              )}
              
              <a 
                href="https://wa.me/919000000000" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full mt-2 px-4 py-3 text-center rounded-lg bg-[var(--rc-orange)] text-white font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors shadow-md text-base"
              >
                Order Now
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}

