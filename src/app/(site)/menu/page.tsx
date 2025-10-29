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
    <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
      <div className="w-[95%] mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold text-[var(--rc-espresso-brown)]">Menu</h1>
        </div>
        <p className="text-lg text-[var(--rc-text-secondary)] max-w-4xl font-medium mb-8 whitespace-nowrap">From our mini burgers and sandwiches to our specials, everything is freshly crafted with wholesome ingredients right in front of you.</p>
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


