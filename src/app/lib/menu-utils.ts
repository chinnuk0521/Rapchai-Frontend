/**
 * Utility functions for menu navigation and category handling
 */

/**
 * Generate a URL for navigating to a specific category on the menu page
 * @param category - Category name or slug
 * @returns URL path with category query parameter
 */
export function getCategoryMenuUrl(category: string | { name?: string; slug?: string }): string {
  let categoryParam = '';
  
  if (typeof category === 'string') {
    categoryParam = encodeURIComponent(category);
  } else if (category?.slug) {
    categoryParam = encodeURIComponent(category.slug);
  } else if (category?.name) {
    categoryParam = encodeURIComponent(category.name);
  }
  
  return `/menu${categoryParam ? `?category=${categoryParam}` : ''}`;
}

/**
 * Normalize a category identifier for matching
 * @param str - Category name or slug
 * @returns Normalized string for comparison
 */
export function normalizeCategory(str: string | null | undefined): string {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/\s+/g, '-');
}

