import { Suspense } from "react";
import MenuClient from "./MenuClient";

export const metadata = {
  title: "Menu",
  description: "Our affordable vibrant cafe offers a healthy continental menu inspired by the best styles of cooking.",
};

function MenuClientWrapper() {
  return <MenuClient />;
}

export default function MenuPage() {
  return (
    <div className="py-6 md:py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
      <div className="w-full container-px">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo-orange.svg" alt="RAPCHAI" className="h-10 w-10 md:h-12 md:w-12" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[var(--rc-espresso-brown)]">Menu</h1>
          </div>
        </div>
        <p className="text-sm md:text-base lg:text-lg text-[var(--rc-text-secondary)] max-w-4xl font-medium mb-6 md:mb-8 leading-relaxed">From our mini burgers and sandwiches to our specials, everything is freshly crafted with wholesome ingredients right in front of you.</p>
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rc-orange)] mx-auto mb-4"></div>
              <p className="text-[var(--rc-text-secondary)]">Loading menu...</p>
            </div>
          </div>
        }>
          <MenuClientWrapper />
        </Suspense>
      </div>
    </div>
  );
}


