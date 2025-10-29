"use client";
import { useAuth } from "../lib/auth-hydration-safe";
import Link from "next/link";

export default function AdminModeButton() {
  const { isAuthenticated, isAdmin } = useAuth();

  // Don't show button if already admin
  if (isAuthenticated && isAdmin) {
    return (
      <Link
        href="/admin/dashboard"
        className="px-6 py-3 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold rounded-xl hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all transform hover:scale-105 shadow-lg"
      >
        🏢 Admin Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/admin/login"
      className="px-6 py-3 bg-white border-2 border-[var(--rc-orange)] text-[var(--rc-orange)] font-bold rounded-xl hover:bg-[var(--rc-orange)] hover:text-white transition-all transform hover:scale-105 shadow-lg"
    >
      🏢 Switch to Admin Mode
    </Link>
  );
}
