"use client";

import { usePathname } from "next/navigation";
import CustomerNavBar from "./CustomerNavBar";
import AdminNavBar from "./AdminNavBar";
import UnifiedCart from "./UnifiedCart";

export default function DynamicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide NavBar on landing and onboarding pages
  const hideNavBar = pathname === "/" || pathname === "/landing" || pathname === "/onboarding";
  
  // Check if route is admin or customer
  const isAdminRoute = pathname?.startsWith("/admin");
  const isCustomerRoute = !isAdminRoute && !hideNavBar;
  
  const mainPadding = hideNavBar ? "" : "pt-16";

  return (
    <>
      {!hideNavBar && (
        isAdminRoute ? <AdminNavBar /> : isCustomerRoute ? <CustomerNavBar /> : null
      )}
      <div className={`w-full ${mainPadding}`}>
        {children}
      </div>
      {/* Show cart on customer routes only */}
      {isCustomerRoute && <UnifiedCart />}
    </>
  );
}

