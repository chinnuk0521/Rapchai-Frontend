"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar-hydration-safe";

export default function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Hide NavBar on landing and onboarding pages
  const hideNavBar = pathname === "/" || pathname === "/landing" || pathname === "/onboarding";

  if (hideNavBar) {
    return null;
  }

  return <NavBar />;
}

