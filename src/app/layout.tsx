import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import NavBar from "./components/NavBar";
import ConditionalFooter from "./components/ConditionalFooter";

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
};

function Footer(): JSX.Element {
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

function JsonLd(): JSX.Element {
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
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
        suppressHydrationWarning={true}
      >
        <JsonLd />
        <NavBar />
        <main className="w-full pt-16">
        {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
