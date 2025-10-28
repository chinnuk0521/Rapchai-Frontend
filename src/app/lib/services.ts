// API Service Functions for different endpoints
import api from './api';
import type {
  MenuItem,
  Category,
  Order,
  CreateOrderRequest,
  Event,
  Booking,
  User,
  AuthResponse,
  DashboardAnalytics,
  PaginationParams,
  MenuQueryParams,
  OrderQueryParams,
  PaginatedResponse,
} from './types';

// Helper function to build query string with proper type handling
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

// Menu API Services
export const menuApi = {
  // Get all categories
  getCategories: (params?: PaginationParams): Promise<PaginatedResponse<Category>> =>
    api.get(`/menu/categories${params ? `?${buildQueryString(params)}` : ''}`),

  // Get category by ID
  getCategoryById: (id: string): Promise<{ category: Category }> =>
    api.get(`/menu/categories/${id}`),

  // Get all menu items
  getMenuItems: (params?: MenuQueryParams): Promise<PaginatedResponse<MenuItem>> =>
    api.get(`/menu/items${params ? `?${buildQueryString(params)}` : ''}`),

  // Get menu item by ID
  getMenuItemById: (id: string): Promise<{ item: MenuItem }> =>
    api.get(`/menu/items/${id}`),

  // Search menu items
  searchMenuItems: (params?: MenuQueryParams): Promise<PaginatedResponse<MenuItem>> =>
    api.get(`/menu/search${params ? `?${buildQueryString(params)}` : ''}`),

  // Admin: Create category
  createCategory: (data: Partial<Category>): Promise<{ category: Category }> =>
    api.post('/menu/categories', data),

  // Admin: Update category
  updateCategory: (id: string, data: Partial<Category>): Promise<{ category: Category }> =>
    api.put(`/menu/categories/${id}`, data),

  // Admin: Delete category
  deleteCategory: (id: string): Promise<{ message: string }> =>
    api.delete(`/menu/categories/${id}`),

  // Admin: Create menu item
  createMenuItem: (data: Partial<MenuItem>): Promise<{ item: MenuItem }> =>
    api.post('/menu/items', data),

  // Admin: Update menu item
  updateMenuItem: (id: string, data: Partial<MenuItem>): Promise<{ item: MenuItem }> =>
    api.put(`/menu/items/${id}`, data),

  // Admin: Bulk create menu items
  bulkCreateMenuItems: (items: any[]): Promise<{ success: number; errors: number; results: MenuItem[]; errors: any[] }> =>
    api.post('/menu/items/bulk', { items }),
};

// Order API Services
export const orderApi = {
  // Create order
  createOrder: (data: CreateOrderRequest): Promise<{ order: Order }> =>
    api.post('/orders', data),

  // Get all orders (admin)
  getOrders: (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> =>
    api.get(`/orders${params ? `?${buildQueryString(params)}` : ''}`),

  // Get order by ID
  getOrderById: (id: string): Promise<{ order: Order }> =>
    api.get(`/orders/${id}`),

  // Update order status (admin)
  updateOrderStatus: (id: string, status: string): Promise<{ order: Order }> =>
    api.patch(`/orders/${id}/status`, { status }),

  // Update payment status (admin)
  updatePaymentStatus: (id: string, paymentStatus: string): Promise<{ order: Order }> =>
    api.patch(`/orders/${id}/payment`, { paymentStatus }),

  // Cancel order
  cancelOrder: (id: string): Promise<{ order: Order }> =>
    api.patch(`/orders/${id}/cancel`),

  // Get orders by customer
  getOrdersByCustomer: (customerId: string, params?: PaginationParams): Promise<PaginatedResponse<Order>> =>
    api.get(`/orders/customer/${customerId}${params ? `?${buildQueryString(params)}` : ''}`),

  // Get today's orders (admin)
  getTodaysOrders: (params?: PaginationParams): Promise<PaginatedResponse<Order>> =>
    api.get(`/orders/today${params ? `?${buildQueryString(params)}` : ''}`),
};

// Event API Services
export const eventApi = {
  // Get all events
  getEvents: (params?: PaginationParams): Promise<PaginatedResponse<Event>> =>
    api.get(`/admin/events${params ? `?${buildQueryString(params)}` : ''}`),

  // Get event by ID
  getEventById: (id: string): Promise<{ event: Event }> =>
    api.get(`/admin/events/${id}`),

  // Create event (admin)
  createEvent: (data: Partial<Event>): Promise<{ event: Event }> =>
    api.post('/admin/events', data),

  // Update event (admin)
  updateEvent: (id: string, data: Partial<Event>): Promise<{ event: Event }> =>
    api.put(`/admin/events/${id}`, data),

  // Delete event (admin)
  deleteEvent: (id: string): Promise<{ message: string }> =>
    api.delete(`/admin/events/${id}`),
};

// Booking API Services
export const bookingApi = {
  // Get all bookings (admin)
  getBookings: (params?: PaginationParams): Promise<PaginatedResponse<Booking>> =>
    api.get(`/admin/bookings${params ? `?${buildQueryString(params)}` : ''}`),

  // Get booking by ID (admin)
  getBookingById: (id: string): Promise<{ booking: Booking }> =>
    api.get(`/admin/bookings/${id}`),

  // Create booking
  createBooking: (data: Partial<Booking>): Promise<{ booking: Booking }> =>
    api.post('/admin/bookings', data),

  // Update booking status (admin)
  updateBookingStatus: (id: string, status: string): Promise<{ booking: Booking }> =>
    api.patch(`/admin/bookings/${id}/status`, { status }),
};

// Auth API Services
export const authApi = {
  // Register user
  register: (data: { name: string; email: string; password: string }): Promise<AuthResponse> =>
    api.post('/auth/register', data),

  // Login user
  login: (data: { email: string; password: string }): Promise<AuthResponse> =>
    api.post('/auth/login', data),

  // Refresh token
  refreshToken: (data: { refreshToken: string }): Promise<{ accessToken: string; refreshToken: string }> =>
    api.post('/auth/refresh', data),

  // Logout user
  logout: (): Promise<{ message: string }> =>
    api.post('/auth/logout'),

  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> =>
    api.post('/auth/change-password', data),

  // Get current user profile
  getProfile: (): Promise<{ user: User }> =>
    api.get('/auth/me'),

  // Update user profile
  updateProfile: (data: Partial<User>): Promise<{ user: User }> =>
    api.put('/auth/me', data),

  // Admin: Get all users
  getUsers: (params?: PaginationParams): Promise<PaginatedResponse<User>> =>
    api.get(`/auth/admin/users${params ? `?${buildQueryString(params)}` : ''}`),

  // Admin: Create user
  createUser: (data: Partial<User>): Promise<{ user: User }> =>
    api.post('/auth/admin/users', data),

  // Admin: Get user by ID
  getUserById: (id: string): Promise<{ user: User }> =>
    api.get(`/auth/admin/users/${id}`),

  // Admin: Update user
  updateUser: (id: string, data: Partial<User>): Promise<{ user: User }> =>
    api.put(`/auth/admin/users/${id}`, data),
};

// Admin API Services
export const adminApi = {
  // Get dashboard analytics
  getDashboardAnalytics: (): Promise<DashboardAnalytics> =>
    api.get('/admin/dashboard'),

  // Get sales analytics
  getSalesAnalytics: (startDate?: string, endDate?: string): Promise<{ analytics: any }> =>
    api.get(`/admin/analytics/sales${startDate || endDate ? `?${buildQueryString({ startDate, endDate })}` : ''}`),

  // Get customer analytics
  getCustomerAnalytics: (startDate?: string, endDate?: string): Promise<{ analytics: any }> =>
    api.get(`/admin/analytics/customers${startDate || endDate ? `?${buildQueryString({ startDate, endDate })}` : ''}`),
};

// Health API Services
export const healthApi = {
  // Health check
  healthCheck: (): Promise<any> =>
    api.get('/health'),

  // Test endpoint
  test: (): Promise<any> =>
    api.get('/test'),
};
