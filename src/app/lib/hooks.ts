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
      
      const [itemsResponse, categoriesResponse] = await Promise.all([
        menuApi.getMenuItems({ limit: 100 }), // Get all items
        menuApi.getCategories({ limit: 100 }), // Get all categories
      ]);

      // Log responses for debugging (remove in production)
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('[useMenuData] Items response:', itemsResponse);
        console.log('[useMenuData] Categories response:', categoriesResponse);
      }

      // Handle different response formats
      // Backend might return: { data: [...], pagination: {...} } or just [...]
      const itemsData = (itemsResponse as any)?.data || (Array.isArray(itemsResponse) ? itemsResponse : []);
      const categoriesData = (categoriesResponse as any)?.data || (Array.isArray(categoriesResponse) ? categoriesResponse : []);

      // Transform API data to frontend format
      const transformedItems = (itemsData || []).map((item: any) => ({
        ...item,
        price: item.pricePaise ? item.pricePaise / 100 : (item.price || 0), // Convert paise to rupees
        veg: item.isVeg !== undefined ? item.isVeg : item.veg,
        available: item.isAvailable !== undefined ? item.isAvailable : item.available,
        title: item.name, // For backward compatibility
        imageUrl: item.imageUrl, // Ensure imageUrl is passed through
      }));

      const transformedCategories = (categoriesData || []).map((cat: any) => ({
        ...cat,
        name: cat.name,
        imageUrl: cat.imageUrl, // Ensure category imageUrl is passed through
        isActive: cat.isActive !== undefined ? cat.isActive : true, // Default to active if not specified
      }));

      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('[useMenuData] Transformed items:', transformedItems.length);
        console.log('[useMenuData] Transformed categories:', transformedCategories.length);
      }

      setMenuItems(transformedItems);
      setCategories(transformedCategories);
      setLoading({ isLoading: false, error: null });
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
