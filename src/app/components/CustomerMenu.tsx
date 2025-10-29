"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { IMG } from "../lib/images";

type MenuItem = { id: number; title: string; veg: boolean; price: number; category: string; available: boolean; imageUrl?: string };

interface CustomerMenuProps {
  items: MenuItem[];
}

export default function CustomerMenu({ items }: CustomerMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [vegOnly, setVegOnly] = useState<boolean | null>(null);

  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = items.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const vegMatch = vegOnly === null || item.veg === vegOnly;
    return categoryMatch && vegMatch;
  });

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

  const addToCart = (item: MenuItem) => {
    const event = new CustomEvent('addToCart', { detail: item });
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[var(--rc-espresso-brown)] mb-4">Rapchai Café</h1>
        <p className="text-lg text-[var(--rc-text-secondary)] font-medium">
          Scan QR Code • Order Online • Pay via UPI
        </p>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        {/* Veg/Non-Veg Filter */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setVegOnly(null)}
            className={`px-6 py-3 rounded-full transition-all duration-300 font-bold text-sm shadow-md ${
              vegOnly === null
                ? "bg-[var(--rc-espresso-brown)] text-white border-2 border-[var(--rc-espresso-brown)]"
                : "bg-white text-[var(--rc-espresso-brown)] border-2 border-[var(--rc-espresso-brown)]/30 hover:border-[var(--rc-espresso-brown)] hover:bg-[var(--rc-creamy-beige)]"
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setVegOnly(true)}
            className={`px-6 py-3 rounded-full transition-all duration-300 font-bold text-sm shadow-md ${
              vegOnly === true
                ? "bg-[var(--rc-espresso-brown)] text-white border-2 border-[var(--rc-espresso-brown)]"
                : "bg-white text-[var(--rc-espresso-brown)] border-2 border-[var(--rc-espresso-brown)]/30 hover:border-[var(--rc-espresso-brown)] hover:bg-[var(--rc-creamy-beige)]"
            }`}
          >
            Veg Only
          </button>
          <button
            onClick={() => setVegOnly(false)}
            className={`px-6 py-3 rounded-full transition-all duration-300 font-bold text-sm shadow-md ${
              vegOnly === false
                ? "bg-[var(--rc-espresso-brown)] text-white border-2 border-[var(--rc-espresso-brown)]"
                : "bg-white text-[var(--rc-espresso-brown)] border-2 border-[var(--rc-espresso-brown)]/30 hover:border-[var(--rc-espresso-brown)] hover:bg-[var(--rc-creamy-beige)]"
            }`}
          >
            Non-Veg
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-bold text-sm shadow-md ${
                activeCategory === category
                  ? "bg-[var(--rc-orange)] text-white border-2 border-[var(--rc-orange)]"
                  : "bg-white text-[var(--rc-espresso-brown)] border-2 border-[var(--rc-espresso-brown)]/30 hover:border-[var(--rc-espresso-brown)] hover:bg-[var(--rc-creamy-beige)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              item.available 
                ? 'bg-white border-2 border-[var(--rc-orange)]/20' 
                : 'bg-gray-100 border-2 border-gray-300 opacity-60'
            }`}
          >
            {/* Item Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={item.imageUrl || getImageForCategory(item.category)}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                quality={85}
              />
              
              {/* Veg/Non-Veg Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                  item.veg ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {item.veg ? 'Veg' : 'Non-Veg'}
                </span>
              </div>

              {/* Out of Stock Overlay */}
              {!item.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-[var(--rc-espresso-brown)] text-lg leading-tight">{item.title}</h3>
                <span className="text-2xl font-black text-[var(--rc-orange)] ml-2">₹{item.price}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--rc-text-secondary)] bg-[var(--rc-creamy-beige)] px-3 py-1 rounded-full">
                  {item.category}
                </span>
                
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                    item.available
                      ? 'bg-[var(--rc-orange)] text-white hover:bg-[var(--rc-espresso-brown)] hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {item.available ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-2">No items found</h3>
          <p className="text-[var(--rc-text-secondary)] font-medium">Try adjusting your filters to see more items.</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-r from-[var(--rc-orange)]/10 to-[var(--rc-espresso-brown)]/10 rounded-2xl p-6 text-center">
        <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-3">How to Order</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-2">🛒</div>
            <div className="font-semibold text-[var(--rc-espresso-brown)]">1. Add Items</div>
            <div className="text-[var(--rc-text-secondary)]">Tap "Add to Cart" for desired items</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-2">💳</div>
            <div className="font-semibold text-[var(--rc-espresso-brown)]">2. Pay via UPI</div>
            <div className="text-[var(--rc-text-secondary)]">Pay using any UPI app</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-2">📱</div>
            <div className="font-semibold text-[var(--rc-espresso-brown)]">3. Send Order</div>
            <div className="text-[var(--rc-text-secondary)]">Order sent to kitchen via WhatsApp</div>
          </div>
        </div>
      </div>
    </div>
  );
}
