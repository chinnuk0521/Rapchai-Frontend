"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Don't render footer on homepage since HomeFooter is used there
  if (isHomePage) {
    return null;
  }

  return (
    <footer className="mt-24 border-t border-black/10">
      <div className="w-full container-px py-10 grid gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="text-lg font-semibold">RAPCHAI</div>
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
      <div className="border-t border-black/10 py-4 text-center text-xs opacity-75">© 2025 RAPCHAI</div>
    </footer>
  );
}
