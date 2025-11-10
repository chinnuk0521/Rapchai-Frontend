"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HydrationSafe } from "./HydrationSafe";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't render footer on landing, onboarding, home, and admin routes
  const hideFooter = 
    pathname === "/" || 
    pathname === "/landing" || 
    pathname === "/onboarding" || 
    pathname === "/home" ||
    pathname?.startsWith("/admin");

  if (hideFooter) {
    return null;
  }

  return (
    <HydrationSafe>
      <footer className="mt-12 md:mt-24 border-t border-black/10 bg-[var(--rc-creamy-beige)]">
        <div className="w-full container-px py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <img src="/logo-brown.svg" alt="Logo" className="h-16 w-16 md:h-20 md:w-20" />
              </div>
              <p className="text-sm md:text-base text-[var(--rc-text-secondary)] leading-relaxed">
                Koramangala, Bangalore — Café meets culture.
              </p>
              <div className="flex flex-wrap gap-4 md:gap-6 pt-2">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 md:py-1.5 text-sm md:text-base font-semibold text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors bg-white rounded-lg border border-[var(--rc-espresso-brown)]/20 hover:border-[var(--rc-orange)]"
                >
                  Instagram
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 md:py-1.5 text-sm md:text-base font-semibold text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors bg-white rounded-lg border border-[var(--rc-espresso-brown)]/20 hover:border-[var(--rc-orange)]"
                >
                  YouTube
                </a>
                <a 
                  href="https://wa.me/919000000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 md:py-1.5 text-sm md:text-base font-semibold text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors bg-white rounded-lg border border-[var(--rc-espresso-brown)]/20 hover:border-[var(--rc-orange)]"
                >
                  WhatsApp
                </a>
              </div>
            </div>
            
            {/* Links and Hours Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-3 md:space-y-4">
                <div className="text-base md:text-lg font-bold text-[var(--rc-espresso-brown)]">Quick Links</div>
                <ul className="space-y-2 md:space-y-3">
                  <li>
                    <Link 
                      href="/" 
                      className="block py-2 text-sm md:text-base text-[var(--rc-text-secondary)] hover:text-[var(--rc-orange)] transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/menu" 
                      className="block py-2 text-sm md:text-base text-[var(--rc-text-secondary)] hover:text-[var(--rc-orange)] transition-colors"
                    >
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/events" 
                      className="block py-2 text-sm md:text-base text-[var(--rc-text-secondary)] hover:text-[var(--rc-orange)] transition-colors"
                    >
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contact" 
                      className="block py-2 text-sm md:text-base text-[var(--rc-text-secondary)] hover:text-[var(--rc-orange)] transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/catering" 
                      className="block py-2 text-sm md:text-base text-[var(--rc-text-secondary)] hover:text-[var(--rc-orange)] transition-colors"
                    >
                      Private Dining
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="text-base md:text-lg font-bold text-[var(--rc-espresso-brown)]">Hours</div>
                <div className="space-y-2 text-sm md:text-base text-[var(--rc-text-secondary)] leading-relaxed">
                  <p>Mon–Sat: 11 AM – 9 PM</p>
                  <p>Sunday: by appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-black/10 py-4 md:py-6 text-center">
          <p className="text-xs md:text-sm text-[var(--rc-text-muted)] opacity-80">
            © 2025. All rights reserved.
          </p>
        </div>
      </footer>
    </HydrationSafe>
  );
}
