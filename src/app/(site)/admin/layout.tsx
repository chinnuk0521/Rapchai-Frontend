"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-hydration-safe";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  // Protect admin routes (except login)
  useEffect(() => {
    if (!isLoading && !isLoginPage) {
      if (!isAuthenticated || !isAdmin) {
        router.push("/admin/login");
      }
    } else if (!isLoading && isLoginPage && isAuthenticated && isAdmin) {
      // If already logged in, redirect to dashboard
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, isAdmin, isLoading, isLoginPage, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--rc-creamy-beige)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rc-orange)] mx-auto mb-4"></div>
          <p className="text-[var(--rc-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

