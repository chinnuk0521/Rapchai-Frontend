import MenuClient from "./MenuClient";

export const metadata = {
  title: "Menu",
  description: "Our affordable vibrant cafe offers a healthy continental menu inspired by the best styles of cooking.",
};

export default function MenuPage() {
  return (
    <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
      <div className="w-[95%] mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold text-[var(--rc-espresso-brown)]">Menu</h1>
        </div>
        <p className="text-lg text-[var(--rc-text-secondary)] max-w-4xl font-medium mb-8 whitespace-nowrap">From our mini burgers and sandwiches to our specials, everything is freshly crafted with wholesome ingredients right in front of you.</p>
        <MenuClient />
      </div>
    </div>
  );
}


