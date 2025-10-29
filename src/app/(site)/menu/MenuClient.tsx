"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RobustImage from "../../components/RobustImage";
import { IMG } from "../../lib/images";
// Cart is now handled globally via UnifiedCart in DynamicLayout
import { useMenuData } from "../../lib/hooks";
import { normalizeCategory } from "../../lib/menu-utils";
import type { MenuItem, Category } from "../../lib/types";

const getImageForCategory = (category: string): string => {
  switch (category) {
    case "Chais & Signature Coffees": return IMG.chai;
    case "Mini Burgers": return IMG.burger;
    case "Sandwiches": return IMG.sandwich;
    case "Rolls & Soups": return IMG.roll;
    case "Our Specials": return IMG.special;
    case "Our Squares": return IMG.square;
    // Legacy mappings for backward compatibility
    case "Chai/Coffee": return IMG.chai;
    case "Rolls": return IMG.roll;
    case "Soups": return IMG.soup;
    case "Salads": return IMG.salad;
    case "Steaks": return IMG.steak;
    case "Specials": return IMG.special;
    case "Squares": return IMG.square;
    default: return IMG.coffee;
  }
};

export default function MenuClient() {
  const { menuItems, categories, loading, refetch } = useMenuData();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [vegOnly, setVegOnly] = useState<boolean | null>(null);
  
  // Get category from URL query parameter
  const categoryFromUrl = searchParams.get('category') || null;
  
  // Use API data only - no fallback to static data
  const items = menuItems;
  
  // Handle category click - navigate to filtered view
  const handleCategoryClick = (category: Category) => {
    const categoryParam = category.slug || category.name;
    router.push(`/menu?category=${encodeURIComponent(categoryParam)}`);
  };

  // Filter items based on category from URL and veg filter
  const filtered = items
    .filter((it) => (vegOnly === null ? true : vegOnly ? it.veg : !it.veg))
    .filter((it) => {
      // If no category in URL, show all items
      if (!categoryFromUrl) return true;
      
      // Handle both old format (string) and new format (object with name property)
      const categoryName = typeof it.category === 'string' ? it.category : it.category?.name;
      const categorySlug = typeof it.category === 'object' && it.category?.slug ? it.category.slug : null;
      
      // Normalize for comparison (case-insensitive, handle spaces)
      const urlCategoryNormalized = normalizeCategory(categoryFromUrl);
      const itemCategoryNameNormalized = normalizeCategory(categoryName);
      const itemCategorySlugNormalized = normalizeCategory(categorySlug);
      
      // Match by name (normalized) or slug
      return (
        itemCategoryNameNormalized === urlCategoryNormalized ||
        itemCategorySlugNormalized === urlCategoryNormalized ||
        // Also try direct match (in case category name has different format)
        categoryName?.toLowerCase().trim() === categoryFromUrl.toLowerCase().trim()
      );
    });

  // Loading state
  if (loading.isLoading && items.length === 0 && categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rc-orange)] mx-auto mb-4"></div>
          <p className="text-[var(--rc-text-secondary)]">Loading menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loading.error && items.length === 0 && categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-600 font-semibold mb-2">Failed to load menu</p>
          <p className="text-red-500 text-sm mb-4">{loading.error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show category cards when no category is selected
  if (!categoryFromUrl) {
    return (
      <>
        <div className="space-y-8">
          {/* Category Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories
              .filter((cat) => cat.isActive === true) // Only show active categories
              .map((category) => {
                // Get item count for this category
                const itemCount = items.filter((it) => {
                  const itemCategoryName = typeof it.category === 'string' ? it.category : it.category?.name;
                  const itemCategorySlug = typeof it.category === 'object' && it.category?.slug ? it.category.slug : null;
                  return (
                    itemCategoryName === category.name ||
                    itemCategorySlug === category.slug
                  );
                }).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-[var(--rc-creamy-beige)] shadow-xl ring-2 ring-[var(--rc-orange)]/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                  >
                    {/* Category Image */}
                    <div className="relative h-48 overflow-hidden">
                      <RobustImage
                        src={category.imageUrl || getImageForCategory(category.name)}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        loading="lazy"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                    </div>
                    
                    {/* Category Info */}
                    <div className="p-6 text-center">
                      <h3 className="font-black text-[var(--rc-espresso-brown)] text-lg mb-2 group-hover:text-[var(--rc-orange)] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-[var(--rc-text-secondary)] font-semibold">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    {/* Hover Arrow Indicator */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-[var(--rc-orange)] flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Empty State for Categories */}
          {categories.filter((cat) => cat.isActive === true).length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-2">No categories available</h3>
              <p className="text-[var(--rc-text-secondary)] font-medium">Categories will appear here once they are added.</p>
            </div>
          )}
        </div>

        {/* Cart Component - Now handled globally via UnifiedCart */}
      </>
    );
  }

  // Show filtered menu items when category is selected
  return (
    <>
      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/menu')}
          className="flex items-center gap-2 text-[var(--rc-espresso-brown)] hover:text-[var(--rc-orange)] transition-colors font-semibold mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Categories
        </button>

        {/* Filter Bar - ALL | Veg | Non-Veg */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
                ALL
              </button>
              <button 
                onClick={() => setVegOnly(true)} 
                className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-bold text-sm ${
                  vegOnly===true 
                    ? "bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white border-transparent shadow-lg" 
                    : "bg-white text-[var(--rc-espresso-brown)] border-[var(--rc-espresso-brown)]/20 hover:border-[var(--rc-orange)] hover:bg-[var(--rc-orange)]/5"
                }`}
              >
                Veg
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
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((it) => (
            <div key={it.id} className="group rounded-3xl bg-gradient-to-br from-white to-[var(--rc-creamy-beige)] shadow-2xl ring-2 ring-[var(--rc-orange)]/20 overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <RobustImage
                  src={it.imageUrl || getImageForCategory(typeof it.category === 'string' ? it.category : it.category?.name)}
                  alt={it.name || it.title}
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
                  <h3 className="font-black text-[var(--rc-espresso-brown)] text-xl leading-tight">{it.name || it.title}</h3>
                  <div className="text-2xl font-black text-[var(--rc-orange)] ml-4">₹{it.price}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--rc-text-secondary)] bg-[var(--rc-creamy-beige)] px-3 py-1 rounded-full">
                    {typeof it.category === 'string' ? it.category : it.category?.name}
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
            <p className="text-[var(--rc-text-secondary)] font-medium mb-4">
              {categoryFromUrl 
                ? `No items found in "${decodeURIComponent(categoryFromUrl)}" category.`
                : "Try adjusting your filters to see more items."}
            </p>
            <button
              onClick={() => {
                setVegOnly(null);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Cart Component - Now handled globally via UnifiedCart */}
    </>
  );
}

// Add to Cart Button Component
function AddToCartButton({ item }: { item: any }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Convert API data to frontend format if needed
    const cartItem = {
      id: item.id,
      title: item.name || item.title,
      veg: item.veg,
      price: item.price,
      category: typeof item.category === 'string' ? item.category : item.category?.name,
      available: item.available !== false, // Default to true if not specified
    };
    
    // Dispatch custom event to add item to cart
    const event = new CustomEvent('addToCart', { detail: cartItem });
    window.dispatchEvent(event);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const isAvailable = item.available !== false;

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isAdding || !isAvailable}
      className={`transition-colors font-bold text-sm group-hover:scale-110 transform duration-300 disabled:opacity-50 ${
        isAvailable 
          ? 'text-[var(--rc-orange)] hover:text-[var(--rc-espresso-brown)]' 
          : 'text-gray-400 cursor-not-allowed'
      }`}
    >
      {!isAvailable ? 'Unavailable' : isAdding ? 'Added!' : 'Add to Cart →'}
    </button>
  );
}