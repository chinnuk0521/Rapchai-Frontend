"use client";
import { useState } from "react";
import Image from "next/image";
import { IMG } from "../../lib/images";
import Cart from "../../components/Cart";

type MenuItem = { id: number; title: string; veg: boolean; price: number; category: string };

const getImageForCategory = (category: string): string => {
  switch (category) {
    case "Chai/Coffee": return IMG.chai;
    case "Mini Burgers": return IMG.burger;
    case "Sandwiches": return IMG.sandwich;
    case "Rolls": return IMG.roll;
    case "Soups": return IMG.soup;
    case "Salads": return IMG.salad;
    case "Steaks": return IMG.steak;
    case "Specials": return IMG.special;
    case "Squares": return IMG.square;
    default: return IMG.coffee;
  }
};

export default function MenuClient({ items, categories }: { items: MenuItem[]; categories: string[] }) {
  const [vegOnly, setVegOnly] = useState<boolean | null>(null);
  const [active, setActive] = useState<string | "All">("All");
  
  const filtered = items
    .filter((it) => (vegOnly === null ? true : vegOnly ? it.veg : !it.veg))
    .filter((it) => (active === "All" ? true : it.category === active));

  return (
    <>
      <div className="space-y-8">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Veg/Non-Veg Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[var(--rc-text-secondary)]">Filter:</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setVegOnly(null)} 
                className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-bold text-sm ${
                  vegOnly===null 
                    ? "bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white border-transparent shadow-lg" 
                    : "bg-white text-[var(--rc-espresso-brown)] border-[var(--rc-espresso-brown)]/20 hover:border-[var(--rc-orange)] hover:bg-[var(--rc-orange)]/5"
                }`}
              >
                All Items
              </button>
              <button 
                onClick={() => setVegOnly(true)} 
                className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-bold text-sm ${
                  vegOnly===true 
                    ? "bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white border-transparent shadow-lg" 
                    : "bg-white text-[var(--rc-espresso-brown)] border-[var(--rc-espresso-brown)]/20 hover:border-[var(--rc-orange)] hover:bg-[var(--rc-orange)]/5"
                }`}
              >
                Veg Only
              </button>
              <button 
                onClick={() => setVegOnly(false)} 
                className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-bold text-sm ${
                  vegOnly===false 
                    ? "bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white border-transparent shadow-lg" 
                    : "bg-white text-[var(--rc-espresso-brown)] border-[var(--rc-espresso-brown)]/20 hover:border-[var(--rc-orange)] hover:bg-[var(--rc-orange)]/5"
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm font-semibold text-[var(--rc-orange)] bg-[var(--rc-orange)]/10 px-4 py-2 rounded-xl">
            {filtered.length} items found
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-[var(--rc-text-secondary)]">Categories:</div>
          <div className="flex flex-wrap gap-3">
            {["All",...categories].map((c) => (
              <button 
                key={c} 
                onClick={() => setActive(c as typeof active)} 
                className={`px-6 py-3 rounded-xl border-2 whitespace-nowrap transition-all duration-300 font-bold text-sm ${
                  active===c 
                    ? "bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white border-transparent shadow-lg transform scale-105" 
                    : "bg-white text-[var(--rc-espresso-brown)] border-[var(--rc-espresso-brown)]/20 hover:border-[var(--rc-orange)] hover:bg-[var(--rc-orange)]/5 hover:scale-105"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((it) => (
            <div key={it.id} className="group rounded-3xl bg-gradient-to-br from-white to-[var(--rc-creamy-beige)] shadow-2xl ring-2 ring-[var(--rc-orange)]/20 overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={getImageForCategory(it.category)}
                  alt={it.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  quality={85}
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  unoptimized={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    it.veg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {it.veg ? 'VEG' : 'NON-VEG'}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-black text-[var(--rc-espresso-brown)] text-xl leading-tight">{it.title}</h3>
                  <div className="text-2xl font-black text-[var(--rc-orange)] ml-4">₹{it.price}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--rc-text-secondary)] bg-[var(--rc-creamy-beige)] px-3 py-1 rounded-full">
                    {it.category}
                  </span>
                  <AddToCartButton item={it} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-2">No items found</h3>
            <p className="text-[var(--rc-text-secondary)] font-medium">Try adjusting your filters to see more items.</p>
          </div>
        )}
      </div>

      {/* Cart Component */}
      <Cart items={items} />
    </>
  );
}

// Add to Cart Button Component
function AddToCartButton({ item }: { item: MenuItem }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Dispatch custom event to add item to cart
    const event = new CustomEvent('addToCart', { detail: item });
    window.dispatchEvent(event);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isAdding}
      className="text-[var(--rc-orange)] hover:text-[var(--rc-espresso-brown)] transition-colors font-bold text-sm group-hover:scale-110 transform duration-300 disabled:opacity-50"
    >
      {isAdding ? 'Added!' : 'Add to Cart →'}
    </button>
  );
}