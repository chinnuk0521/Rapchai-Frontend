// Custom hooks for API integration with loading states and error handling
import { useState, useEffect, useCallback } from 'react';
import { useApiError } from './api';
import type { LoadingState } from './types';
import { formatDateSSR, formatTimeSSR, formatPriceSSR } from './ssr-utils';

// Generic hook for API calls with loading states
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });
  const { handleError } = useApiError();

  const execute = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    try {
      const result = await apiCall();
      setData(result);
      setLoading({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = handleError(error);
      setLoading({ isLoading: false, error: errorMessage });
      throw error;
    }
  }, dependencies);

  return { data, loading, execute };
}

// Hook for menu data
export function useMenuData() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  const fetchMenuData = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    try {
      // Import services dynamically to avoid circular dependencies
      const { menuApi } = await import('./services');
      
      // Fetch items and categories separately to handle partial failures gracefully
      // If one fails, we can still show the other
      const [itemsResponse, categoriesResponse] = await Promise.allSettled([
        menuApi.getMenuItems({ limit: 100 }), // Get all items
        menuApi.getCategories({ limit: 100 }), // Get all categories
      ]);

      // Handle responses - check if they succeeded or failed
      let itemsResponseData: any = null;
      let categoriesResponseData: any = null;
      const errors: string[] = [];

      if (itemsResponse.status === 'fulfilled') {
        itemsResponseData = itemsResponse.value;
      } else {
        console.error('[useMenuData] Failed to fetch items:', itemsResponse.reason);
        errors.push(`Failed to load menu items: ${itemsResponse.reason?.message || 'Unknown error'}`);
      }

      if (categoriesResponse.status === 'fulfilled') {
        categoriesResponseData = categoriesResponse.value;
      } else {
        console.error('[useMenuData] Failed to fetch categories:', categoriesResponse.reason);
        errors.push(`Failed to load categories: ${categoriesResponse.reason?.message || 'Unknown error'}`);
      }

      // Log responses for debugging
      if (typeof window !== 'undefined') {
        console.log('[useMenuData] Items response:', itemsResponseData);
        console.log('[useMenuData] Categories response:', categoriesResponseData);
        if (itemsResponseData) {
          console.log('[useMenuData] Items response keys:', Object.keys(itemsResponseData || {}));
        }
        if (categoriesResponseData) {
          console.log('[useMenuData] Categories response keys:', Object.keys(categoriesResponseData || {}));
        }
      }

      // Extract data from API response
      // Backend returns: { items: [...], pagination: {...} } or { categories: [...], pagination: {...} }
      // Also support legacy formats: { data: [...] } or raw arrays for backward compatibility
      const itemsData =
        itemsResponseData?.items ??
        itemsResponseData?.data ??
        (Array.isArray(itemsResponseData) ? itemsResponseData : []);
      const categoriesData =
        categoriesResponseData?.categories ??
        categoriesResponseData?.data ??
        (Array.isArray(categoriesResponseData) ? categoriesResponseData : []);

      // Log extracted data for debugging
      if (typeof window !== 'undefined') {
        console.log('[useMenuData] Extracted itemsData:', itemsData.length, itemsData);
        console.log('[useMenuData] Extracted categoriesData:', categoriesData.length, categoriesData);
      }

      // Transform API data to frontend format
      // Map all fields from Supabase schema: id, name, description, pricePaise, imageUrl, isVeg, isAvailable, isActive, calories, prepTime, categoryId, sortOrder, createdAt, updatedAt
      const transformedItems = (itemsData || []).map((item: any) => ({
        ...item, // Preserve all original fields from database
        // Computed/transformed fields for frontend compatibility
        price: item.pricePaise ? item.pricePaise / 100 : (item.price || 0), // Convert paise to rupees
        veg: item.isVeg ?? item.veg ?? true, // Default to veg if not specified
        available: item.isAvailable ?? item.available ?? true, // Default to available if not specified
        title: item.name, // For backward compatibility
      }));

      // Map all fields from Supabase schema: id, name, slug, description, imageUrl, isActive, sortOrder, createdAt, updatedAt
      const transformedCategories = (categoriesData || []).map((cat: any) => ({
        ...cat, // Preserve all original fields from database
        // Only set default for isActive if not specified
        isActive: cat.isActive !== undefined ? cat.isActive : true, // Default to active if not specified
      }));

      if (typeof window !== 'undefined') {
        console.log('[useMenuData] Transformed items:', transformedItems.length);
        console.log('[useMenuData] Transformed categories:', transformedCategories.length);
      }

      setMenuItems(transformedItems);
      setCategories(transformedCategories);
      
      // Only show error if both requests failed
      // If one succeeded, we can still show partial data
      if (errors.length > 0 && transformedItems.length === 0 && transformedCategories.length === 0) {
        setLoading({ isLoading: false, error: errors.join('; ') });
      } else if (errors.length > 0) {
        // Partial failure - show warning but still display available data
        console.warn('[useMenuData] Partial data loaded with errors:', errors);
        setLoading({ isLoading: false, error: null });
      } else {
        setLoading({ isLoading: false, error: null });
      }
    } catch (error) {
      console.error('[useMenuData] Error fetching menu data:', error);
      const { useApiError } = await import('./api');
      const { handleError } = useApiError();
      const errorMessage = handleError(error);
      setLoading({ isLoading: false, error: errorMessage });
      // Set empty arrays on error to prevent showing stale data
      setMenuItems([]);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  return { menuItems, categories, loading, refetch: fetchMenuData };
}

// Hook for events data
export function useEventsData() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  const fetchEvents = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    try {
      const { eventApi } = await import('./services');
      const response = await eventApi.getEvents({ limit: 100 });
      
      // Transform API data to frontend format
      const transformedEvents = (response.data || []).map((event: any) => ({
        ...event,
        eventDate: event.startAt,
        startTime: formatTimeSSR(event.startAt),
        endTime: event.endAt ? formatTimeSSR(event.endAt) : null,
        eventType: event.eventType || 'Music',
        price: formatPriceSSR(event.pricePaise),
        status: event.isActive ? 'upcoming' : 'cancelled',
      }));
      
      setEvents(transformedEvents);
      setLoading({ isLoading: false, error: null });
    } catch (error) {
      const { useApiError } = await import('./api');
      const { handleError } = useApiError();
      const errorMessage = handleError(error);
      setLoading({ isLoading: false, error: errorMessage });
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, refetch: fetchEvents };
}

// Hook for order management
export function useOrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });

  const createOrder = useCallback(async (orderData: any) => {
    setLoading({ isLoading: true, error: null });
    try {
      const { orderApi } = await import('./services');
      const response = await orderApi.createOrder(orderData);
      setLoading({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const { useApiError } = await import('./api');
      const { handleError } = useApiError();
      const errorMessage = handleError(error);
      setLoading({ isLoading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const fetchOrders = useCallback(async (params?: any) => {
    setLoading({ isLoading: true, error: null });
    try {
      const { orderApi } = await import('./services');
      const response = await orderApi.getOrders(params);
      setOrders(response.data || []);
      setLoading({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const { useApiError } = await import('./api');
      const { handleError } = useApiError();
      const errorMessage = handleError(error);
      setLoading({ isLoading: false, error: errorMessage });
    }
  }, []);

  return { orders, loading, createOrder, fetchOrders };
}

// Hook for admin dashboard
export function useAdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    try {
      const { adminApi } = await import('./services');
      const response = await adminApi.getDashboardAnalytics();
      setAnalytics(response);
      setLoading({ isLoading: false, error: null });
    } catch (error) {
      const { useApiError } = await import('./api');
      const { handleError } = useApiError();
      const errorMessage = handleError(error);
      setLoading({ isLoading: false, error: errorMessage });
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, refetch: fetchAnalytics };
}

// Hook for authentication
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading({ isLoading: true, error: null });
    try {
      const { authApi } = await import('./services');
      const { authUtils } = await import('./api');
      
      const response = await authApi.login(credentials);
      authUtils.setToken(response.accessToken);
      setUser(response.user);
      setLoading({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const { useApiError } = await import('./api');
      const { handleError } = useApiError();
      const errorMessage = handleError(error);
      setLoading({ isLoading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { authApi } = await import('./services');
      const { authUtils } = await import('./api');
      
      await authApi.logout();
      authUtils.removeToken();
      setUser(null);
    } catch (error) {
      // Even if logout fails, clear local state
      const { authUtils } = await import('./api');
      authUtils.removeToken();
      setUser(null);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    try {
      const { authApi } = await import('./services');
      const { authUtils } = await import('./api');
      
      if (authUtils.isAuthenticated()) {
        const response = await authApi.getProfile();
        setUser(response.user);
      }
      setLoading({ isLoading: false, error: null });
    } catch (error) {
      const { authUtils } = await import('./api');
      authUtils.removeToken();
      setUser(null);
      setLoading({ isLoading: false, error: null });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { user, loading, login, logout, isAuthenticated: !!user };
}
