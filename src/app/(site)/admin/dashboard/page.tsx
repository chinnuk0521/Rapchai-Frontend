"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../lib/auth-hydration-safe";
import ProtectedRoute from "../../../components/ProtectedRoute";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  orderType: 'dine-in' | 'takeaway';
  items: Array<{
    quantity: number;
    unitPaise: number;
    notes?: string;
    menuItem: {
      id: string;
      name: string;
      pricePaise: number;
      imageUrl: string | null;
      isVeg: boolean;
    };
  }>;
  totalPaise: number;
  status: 'received' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
  paymentStatus: 'pending' | 'paid';
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  pricePaise: number;
  imageUrl: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  isActive: boolean;
  calories: number | null;
  prepTime: number | null;
  categoryId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

// Category Form Component
function CategoryForm({ category, onSubmit, onCancel }: {
  category: Category | null;
  onSubmit: (data: { name: string; slug: string; description?: string; imageUrl?: string }) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    imageUrl: category?.imageUrl || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(category?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'categories'); // Specify folder for categories
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || 'Upload failed');
      }
      
      const result = await response.json();
      return result.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.imageUrl;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      onSubmit({
        ...formData,
        imageUrl,
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors text-[var(--rc-espresso-brown)] font-medium"
          placeholder="Enter category name"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Slug *</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors text-[var(--rc-espresso-brown)] font-medium"
          placeholder="Enter category slug"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors text-[var(--rc-espresso-brown)] font-medium"
          placeholder="Enter category description"
          rows={3}
        />
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Category Image</label>
        <div className="space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Category preview"
                className="w-full h-48 object-cover rounded-xl border-2 border-[var(--rc-espresso-brown)]/20"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                  setFormData({ ...formData, imageUrl: '' });
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}
          
          {/* File Input */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="category-image-upload"
            />
            <label
              htmlFor="category-image-upload"
              className="block w-full px-4 py-3 bg-[var(--rc-orange)] text-white rounded-xl font-bold text-center cursor-pointer hover:bg-[var(--rc-espresso-brown)] transition-colors"
            >
              📷 {imageFile ? 'Change Image' : 'Upload Image'}
            </label>
          </div>
          
          {isUploading && (
            <div className="text-center text-[var(--rc-orange)] font-bold">
              ⏳ Uploading image...
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isUploading}
          className="flex-1 py-3 rounded-xl bg-[var(--rc-orange)] text-white font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : (category ? 'Update Category' : 'Create Category')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Menu Item Form Component
function MenuItemForm({ menuItem, categories, onSubmit, onCancel }: {
  menuItem: MenuItem | null;
  categories: Category[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: menuItem?.name || '',
    description: menuItem?.description || '',
    pricePaise: menuItem ? (menuItem.pricePaise / 100).toString() : '',
    isVeg: menuItem?.isVeg ?? true,
    isAvailable: menuItem?.isAvailable ?? true,
    categorySlug: menuItem?.category?.slug || '',
    calories: menuItem?.calories?.toString() || '',
    prepTime: menuItem?.prepTime?.toString() || '',
    imageUrl: menuItem?.imageUrl || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(menuItem?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'menu-items'); // Specify folder for menu items
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || 'Upload failed');
      }
      
      const result = await response.json();
      return result.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.imageUrl;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const submitData = {
        ...formData,
        pricePaise: Math.round(parseFloat(formData.pricePaise) * 100),
        calories: formData.calories ? parseInt(formData.calories) : null,
        prepTime: formData.prepTime ? parseInt(formData.prepTime) : null,
        imageUrl,
      };
      onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors text-[var(--rc-espresso-brown)] font-medium"
            placeholder="Enter menu item name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Category *</label>
          <select
            value={formData.categorySlug}
            onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors text-[var(--rc-espresso-brown)] font-medium"
            title="Select menu item category"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors text-[var(--rc-espresso-brown)] font-medium"
          placeholder="Enter menu item description"
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Price (₹) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.pricePaise}
            onChange={(e) => setFormData({ ...formData, pricePaise: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors text-[var(--rc-espresso-brown)] font-medium"
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Calories</label>
          <input
            type="number"
            min="0"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors text-[var(--rc-espresso-brown)] font-medium"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Prep Time (min)</label>
          <input
            type="number"
            min="0"
            value={formData.prepTime}
            onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors text-[var(--rc-espresso-brown)] font-medium"
            placeholder="0"
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Menu Item Image</label>
        <div className="space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Menu item preview"
                className="w-full h-48 object-cover rounded-xl border-2 border-[var(--rc-espresso-brown)]/20"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                  setFormData({ ...formData, imageUrl: '' });
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}
          
          {/* File Input */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="menu-item-image-upload"
            />
            <label
              htmlFor="menu-item-image-upload"
              className="block w-full px-4 py-3 bg-[var(--rc-orange)] text-white rounded-xl font-bold text-center cursor-pointer hover:bg-[var(--rc-espresso-brown)] transition-colors"
            >
              📷 {imageFile ? 'Change Image' : 'Upload Image'}
            </label>
          </div>
          
          {isUploading && (
            <div className="text-center text-[var(--rc-orange)] font-bold">
              ⏳ Uploading image...
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isVeg}
            onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
            className="mr-2 w-4 h-4 text-[var(--rc-orange)]"
          />
          <span className="text-sm font-bold text-[var(--rc-espresso-brown)]">Vegetarian</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="mr-2 w-4 h-4 text-[var(--rc-orange)]"
          />
          <span className="text-sm font-bold text-[var(--rc-espresso-brown)]">Available</span>
        </label>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isUploading}
          className="flex-1 py-3 rounded-xl bg-[var(--rc-orange)] text-white font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : (menuItem ? 'Update Menu Item' : 'Create Menu Item')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AdminDashboardContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'categories'>('orders');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const { token, logout, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (token && !authLoading) {
      loadData();
    }
  }, [token, authLoading]);

  const loadData = async () => {
    if (!token) {
      console.error("No authentication token available");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Load orders
      const ordersResponse = await fetch("/api/orders", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      } else if (ordersResponse.status === 401) {
        console.error("Authentication failed - token may be expired");
        logout();
        return;
      }

      // Load menu items
      const menuResponse = await fetch("/api/admin/menu-items", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        setMenuItems(menuData.menuItems || []);
      } else if (menuResponse.status === 401) {
        console.error("Authentication failed - token may be expired");
        logout();
        return;
      }

      // Load categories
      const categoriesResponse = await fetch("/api/admin/categories", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);
      } else if (categoriesResponse.status === 401) {
        console.error("Authentication failed - token may be expired");
        logout();
        return;
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const toggleMenuItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/admin/menu-items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      });

      if (response.ok) {
        setMenuItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, isAvailable: !isAvailable } : item
        ));
      }
    } catch (error) {
      console.error("Failed to update menu item:", error);
    }
  };

  // Category CRUD functions
  const createCategory = async (data: { name: string; slug: string; description?: string }) => {
    if (!token) {
      console.error("No authentication token available");
      return;
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setCategories(prev => [...prev, result.category]);
        setShowAddCategory(false);
      } else if (response.status === 401) {
        console.error("Authentication failed - token may be expired");
        logout();
      }
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const updateCategory = async (id: string, data: { name: string; slug: string; description?: string }) => {
    if (!token) {
      console.error("No authentication token available");
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setCategories(prev => prev.map(cat => 
          cat.id === id ? result.category : cat
        ));
        setEditingCategory(null);
      } else if (response.status === 401) {
        console.error("Authentication failed - token may be expired");
        logout();
      }
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  // Menu Item CRUD functions
  const createMenuItem = async (data: any) => {
    try {
      const response = await fetch("/api/admin/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setMenuItems(prev => [...prev, result.menuItem]);
        setShowAddMenuItem(false);
        loadData(); // Reload to get updated data with category info
      }
    } catch (error) {
      console.error("Failed to create menu item:", error);
    }
  };

  const updateMenuItem = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/admin/menu-items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setMenuItems(prev => prev.map(item => 
          item.id === id ? result.menuItem : item
        ));
        setEditingMenuItem(null);
        loadData(); // Reload to get updated data with category info
      }
    } catch (error) {
      console.error("Failed to update menu item:", error);
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    
    try {
      const response = await fetch(`/api/admin/menu-items/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete menu item:", error);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-[var(--rc-creamy-beige)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rc-orange)] mx-auto mb-4"></div>
          <p className="text-[var(--rc-text-secondary)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--rc-creamy-beige)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white py-4">
        <div className="w-[95%] mx-auto px-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo-orange.svg" alt="Logo" className="h-14 w-14" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-sm opacity-90">Staff Portal</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-[95%] mx-auto px-4 py-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'orders'
                ? 'bg-[var(--rc-orange)] text-white shadow-lg'
                : 'bg-white text-[var(--rc-espresso-brown)] border-2 border-[var(--rc-espresso-brown)]/30 hover:border-[var(--rc-orange)]'
            }`}
          >
            📋 Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'menu'
                ? 'bg-[var(--rc-orange)] text-white shadow-lg'
                : 'bg-white text-[var(--rc-espresso-brown)] border-2 border-[var(--rc-espresso-brown)]/30 hover:border-[var(--rc-orange)]'
            }`}
          >
            🍽️ Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'categories'
                ? 'bg-[var(--rc-orange)] text-white shadow-lg'
                : 'bg-white text-[var(--rc-espresso-brown)] border-2 border-[var(--rc-espresso-brown)]/30 hover:border-[var(--rc-orange)]'
            }`}
          >
            📂 Categories ({categories.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[var(--rc-espresso-brown)]">Order Management</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-2">No orders yet</h3>
                <p className="text-[var(--rc-text-secondary)]">Orders will appear here when customers place them.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[var(--rc-orange)]/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)]">Order #{order.orderNumber}</h3>
                        <p className="text-[var(--rc-text-secondary)]">
                          {order.customerName} • {order.customerPhone}
                        </p>
                        <p className="text-sm text-[var(--rc-text-secondary)]">
                          {order.orderType === 'dine-in' ? `Table ${order.tableNumber}` : 'Takeaway'} • 
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[var(--rc-orange)]">₹{(order.totalPaise / 100).toFixed(2)}</div>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                          order.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {order.paymentStatus === 'paid' ? '✅ Paid' : '❌ Pending'}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-[var(--rc-espresso-brown)] mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.menuItem.name} × {item.quantity}</span>
                            <span className="font-bold">₹{((item.unitPaise * item.quantity) / 100).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="flex gap-3">
                      {(['received', 'preparing', 'ready', 'delivered'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                            order.status === status
                              ? 'bg-[var(--rc-orange)] text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-[var(--rc-espresso-brown)]">Menu Management</h2>
              <button
                onClick={() => setShowAddMenuItem(true)}
                className="px-6 py-3 bg-[var(--rc-orange)] text-white rounded-xl font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors"
              >
                ➕ Add Menu Item
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-[var(--rc-espresso-brown)]/20"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(item.pricePaise / 100).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => toggleMenuItemAvailability(item.id, item.isAvailable)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              item.isAvailable 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {item.isAvailable ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => setEditingMenuItem(item)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-[var(--rc-espresso-brown)]">Category Management</h2>
              <button
                onClick={() => setShowAddCategory(true)}
                className="px-6 py-3 bg-[var(--rc-orange)] text-white rounded-xl font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors"
              >
                ➕ Add Category
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.imageUrl ? (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-[var(--rc-espresso-brown)]/20"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.slug}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {category.description || 'No description'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal */}
        {(showAddCategory || editingCategory) && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-4 border-[var(--rc-orange)]">
              <h3 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-6 text-center">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              
              <CategoryForm
                category={editingCategory}
                onSubmit={(data) => {
                  if (editingCategory) {
                    updateCategory(editingCategory.id, data);
                  } else {
                    createCategory(data);
                  }
                }}
                onCancel={() => {
                  setShowAddCategory(false);
                  setEditingCategory(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Add/Edit Menu Item Modal */}
        {(showAddMenuItem || editingMenuItem) && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-[var(--rc-orange)]">
              <h3 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-6 text-center">
                {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              
              <MenuItemForm
                menuItem={editingMenuItem}
                categories={categories}
                onSubmit={(data) => {
                  if (editingMenuItem) {
                    updateMenuItem(editingMenuItem.id, data);
                  } else {
                    createMenuItem(data);
                  }
                }}
                onCancel={() => {
                  setShowAddMenuItem(false);
                  setEditingMenuItem(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
