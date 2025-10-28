"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NavBar(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    // Only apply scroll behavior on homepage
    if (!isHomePage) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Hide navbar when approaching footer section (last 70% of page)
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
  }, [isHomePage]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--rc-creamy-beige)]/95 border-b-2 border-[var(--rc-orange)]/20 shadow-lg transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}
    >
      <div className="w-full container-px flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-wide text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors" aria-label="RAPCHAI home">
          RAPCHAI
        </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/menu" className="text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Menu</Link>
              <Link href="/order" className="text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Order Online</Link>
              <Link href="/events" className="text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Events</Link>
              <Link href="/catering" className="text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Private Dining</Link>
              <Link href="/gallery" className="text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Gallery</Link>
              <Link href="/contact" className="text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Contact</Link>
              <Link href="/admin" className="text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-bold">Admin</Link>
              <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--rc-orange)] text-white px-4 py-2 text-xs font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors shadow-md">Order Now</a>
            </nav>
      </div>
    </header>
  );
}
