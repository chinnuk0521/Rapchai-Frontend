// API Configuration and Utility Functions
// In production: Use NEXT_PUBLIC_API_URL (your deployed backend URL)
// In development: Use /api which gets rewritten via next.config.ts
const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!envUrl) {
    // No env var set, use relative path for dev
    return '/api';
  }
  
  let baseUrl: string;
  
  // If it's already a full URL (starts with http:// or https://), use it as is
  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    baseUrl = envUrl;
  }
  // If it's a domain without protocol, add https://
  else if (envUrl.includes('.') && !envUrl.startsWith('/')) {
    baseUrl = `https://${envUrl}`;
  }
  // Otherwise, treat it as a relative path
  else {
    return envUrl;
  }
  
  // For absolute URLs (production), ensure /api is included
  // Backend routes all start with /api/ (e.g., /api/menu/items)
  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
    // Remove trailing slash if present
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    // Append /api if not already present
    if (!baseUrl.endsWith('/api')) {
      baseUrl = `${baseUrl}/api`;
    }
  }
  
  return baseUrl;
};

const API_BASE_URL = getApiBaseUrl();

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// API Error Class
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API Request Function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure proper URL construction
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

// API Methods
export const api = {
  // GET request
  get: <T>(endpoint: string): Promise<T> => 
    apiRequest<T>(endpoint, { method: 'GET' }),

  // POST request
  post: <T>(endpoint: string, data?: any): Promise<T> => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PUT request
  put: <T>(endpoint: string, data?: any): Promise<T> => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PATCH request
  patch: <T>(endpoint: string, data?: any): Promise<T> => 
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // DELETE request
  delete: <T>(endpoint: string): Promise<T> => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

// Auth Token Management
export const authUtils = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
};

// Error Handler Hook
export const useApiError = () => {
  const handleError = (error: unknown, fallbackMessage = 'Something went wrong') => {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return fallbackMessage;
  };

  return { handleError };
};

export default api;
