import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import React, { ReactNode } from "react";
import ConditionalFooter from "./components/ConditionalFooter";
import { AuthProvider } from "./lib/auth-hydration-safe";
import { CustomerAuthProvider } from "./lib/customer-auth";
import { CartProvider } from "./lib/cart-context";
import { HydrationBoundary } from "./components/HydrationBoundary";
import DynamicLayout from "./components/DynamicLayout";
import AuthHashHandler from "./components/AuthHashHandler";
import AppInitializer from "./components/AppInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rapchai Café — Where Coffee Meets Beats",
    template: "%s | Rapchai Café",
  },
  description:
    "Rapchai is Bangalore's first café focused on community, serving a healthy continental menu with rap music events, pet-friendly spaces, private dining, and event hosting in Koramangala.",
  openGraph: {
    title: "Rapchai Café — Where Coffee Meets Beats",
    description:
      "Healthy continental menu, rap events, pet-friendly spaces, and event hosting in Koramangala.",
    url: "https://rapchai.com",
    siteName: "Rapchai Café",
    type: "website",
    locale: "en_IN",
  },
  alternates: { canonical: "https://rapchai.com" },
  metadataBase: new URL("https://rapchai.com"),
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff4e6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

function Footer(): React.ReactElement {
  return (
    <footer className="mt-24 border-t border-black/10">
      <div className="w-full container-px py-10 grid gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="text-lg font-semibold">Rapchai Café</div>
          <p className="text-sm opacity-80">Koramangala, Bangalore — Café meets culture.</p>
          <div className="flex gap-4 text-sm">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium">Quick Links</div>
            <ul className="space-y-1">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/menu">Menu</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/catering">Private Dining</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-medium">Hours</div>
            <p>Mon–Sat: 11 AM – 9 PM<br/>Sunday: by appointment</p>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 py-4 text-center text-xs opacity-75">© 2025 Rapchai</div>
    </footer>
  );
}

function JsonLd(): React.ReactElement {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: "Rapchai Café",
    url: "https://rapchai.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "KA",
      addressCountry: "IN",
    },
    servesCuisine: ["Continental", "Cafe"],
    openingHours: ["Mo-Sa 11:00-21:00"],
    sameAs: ["https://instagram.com", "https://youtube.com"],
  } as const;
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Pre-hydration hash handler - catches hash fragments before React loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check for OAuth hash fragments immediately (before React loads)
                var hash = window.location.hash;
                if (hash && hash.length > 10) {
                  try {
                    var hashParams = new URLSearchParams(hash.substring(1));
                    var accessToken = hashParams.get('access_token');
                    var error = hashParams.get('error');
                    
                    if (accessToken || error) {
                      var pathname = window.location.pathname;
                      if (pathname !== '/auth/callback') {
                        console.log('%c🚨 Pre-hydration: OAuth hash detected!', 'color: #FF6B35; font-size: 14px; font-weight: bold;');
                        console.log('%c   Current path:', 'color: #666;', pathname);
                        console.log('%c   Redirecting to /auth/callback...', 'color: #4CAF50; font-weight: bold;');
                        window.location.replace('/auth/callback' + hash);
                      }
                    }
                  } catch (e) {
                    console.error('Pre-hydration hash handler error:', e);
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
        suppressHydrationWarning={true}
      >
        <HydrationBoundary>
          <JsonLd />
          <AppInitializer />
          <AuthHashHandler />
          <AuthProvider>
            <CustomerAuthProvider>
              <CartProvider>
                <DynamicLayout>
                  {children}
                </DynamicLayout>
                <ConditionalFooter />
              </CartProvider>
            </CustomerAuthProvider>
          </AuthProvider>
        </HydrationBoundary>
      </body>
    </html>
  );
}
