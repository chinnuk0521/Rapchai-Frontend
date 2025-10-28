"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../lib/auth";
import ProtectedRoute from "../../../components/ProtectedRoute";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  orderType: 'dine-in' | 'takeaway';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'received' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
  paymentStatus: 'pending' | 'paid';
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

function AdminDashboardContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const { token, logout } = useAuth();

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      // Load orders
      const ordersResponse = await fetch("/api/orders", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.data || []);
      }

      // Load menu items
      const menuResponse = await fetch("/api/menu/items", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        setMenuItems(menuData.data || []);
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
      const response = await fetch(`/api/menu/items/${itemId}`, {
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

  if (isLoading) {
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
            <h1 className="text-2xl font-bold">Rapchai Admin Dashboard</h1>
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
            🍽️ Menu ({menuItems.length})
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
                        <div className="text-2xl font-bold text-[var(--rc-orange)]">₹{order.totalAmount}</div>
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
                            <span>{item.name} × {item.quantity}</span>
                            <span className="font-bold">₹{item.price * item.quantity}</span>
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
            <h2 className="text-3xl font-bold text-[var(--rc-espresso-brown)]">Menu Management</h2>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{item.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
