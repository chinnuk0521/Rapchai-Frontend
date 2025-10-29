"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-hydration-safe";

export default function AdminNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // Don't show navbar on login page
  if (isLoginPage) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--rc-espresso-brown)]/95 border-b-2 border-[var(--rc-orange)]/30 shadow-lg">
      <div className="w-full container-px flex h-16 items-center justify-between">
        <Link href="/admin/dashboard" className="text-xl font-black tracking-wide text-white hover:text-[var(--rc-orange)] transition-colors" aria-label="Admin Dashboard">
          RAPCHAI ADMIN
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link 
            href="/admin/dashboard" 
            className={`px-3 py-2 rounded-lg font-bold text-xs transition-colors ${
              pathname === "/admin/dashboard"
                ? "bg-[var(--rc-orange)] text-white"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Dashboard
          </Link>
          
          {/* User Info */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-white font-semibold">{user.name || user.email}</div>
                <div className="text-xs text-white/70">Admin</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors text-xs"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

