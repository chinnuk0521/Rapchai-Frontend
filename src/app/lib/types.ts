// Type definitions for API responses and frontend data structures

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  pricePaise: number; // Price in paise (divide by 100 for rupees)
  price: number; // Computed field for frontend
  veg: boolean; // Maps to isVeg from API
  available: boolean; // Maps to isAvailable from API
  imageUrl?: string;
  categoryId: string;
  category?: Category;
  calories?: number;
  prepTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  tableNumber?: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  status: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  totalAmount: number;
  notes?: string;
  specialInstructions?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  price: number;
  notes?: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  tableNumber?: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  notes?: string;
  specialInstructions?: string;
  items: {
    menuItemId: string;
    quantity: number;
    notes?: string;
  }[];
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventType: 'Music' | 'Community' | 'Workshop' | 'Private';
  price?: string;
  maxCapacity?: number;
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  id: string;
  eventId?: string;
  event?: Event;
  name: string; // Maps to 'name' from backend
  phone: string; // Maps to 'phone' from backend
  email?: string; // Maps to 'email' from backend
  partySize: number; // Maps to 'partySize' from backend
  date: string; // Maps to 'date' from backend (ISO date string)
  notes?: string; // Maps to 'notes' from backend
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Admin Dashboard Types
export interface DashboardAnalytics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
}

// Cart Types (Frontend specific)
export interface CartItem extends MenuItem {
  quantity: number;
}

// Loading and Error States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// API Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface MenuQueryParams extends PaginationParams {
  categoryId?: string;
  isVeg?: boolean;
  isAvailable?: boolean;
  search?: string;
}

export interface OrderQueryParams extends PaginationParams {
  status?: string;
  orderType?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}
