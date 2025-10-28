"use client";
import { useState, useEffect } from "react";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  orderType: 'dine-in' | 'takeaway';
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'received' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
  paymentStatus: 'pending' | 'paid';
};

type MenuItem = {
  id: number;
  title: string;
  veg: boolean;
  price: number;
  category: string;
  available: boolean;
};

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'reports'>('orders');

  // Sample data - in real app, this would come from your database
  const sampleOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'RC123456',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      tableNumber: '5',
      orderType: 'dine-in',
      items: [
        { title: 'Masala Chai', quantity: 2, price: 79 },
        { title: 'Paneer Sandwich', quantity: 1, price: 189 }
      ],
      totalAmount: 347,
      status: 'received',
      createdAt: new Date().toISOString(),
      paymentStatus: 'paid'
    },
    {
      id: '2',
      orderNumber: 'RC123457',
      customerName: 'Jane Smith',
      customerPhone: '+91 98765 43211',
      orderType: 'takeaway',
      items: [
        { title: 'Mini Burger – Classic', quantity: 1, price: 149 },
        { title: 'Cold Coffee', quantity: 1, price: 99 }
      ],
      totalAmount: 248,
      status: 'preparing',
      createdAt: new Date(Date.now() - 300000).toISOString(),
      paymentStatus: 'paid'
    }
  ];

  const sampleMenuItems: MenuItem[] = [
    { id: 1, title: "Masala Chai", veg: true, price: 79, category: "Chai/Coffee", available: true },
    { id: 2, title: "Filter Coffee", veg: true, price: 89, category: "Chai/Coffee", available: true },
    { id: 3, title: "Cold Coffee", veg: true, price: 99, category: "Chai/Coffee", available: true },
    { id: 4, title: "Mini Burger – Classic", veg: true, price: 149, category: "Mini Burgers", available: true },
    { id: 5, title: "Mini Burger – Chicken", veg: false, price: 169, category: "Mini Burgers", available: true },
    { id: 6, title: "Mini Burger – Beef", veg: false, price: 179, category: "Mini Burgers", available: false },
  ];

  useEffect(() => {
    // Check if already logged in
    const savedLogin = localStorage.getItem('adminLogin');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
    
    // Load sample data
    setOrders(sampleOrders);
    setMenuItems(sampleMenuItems);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in real app, use proper auth
    if (username === 'admin' && password === 'rapchai123') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLogin', 'true');
    } else {
      alert('Invalid credentials. Use: admin / rapchai123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLogin');
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const updateMenuItem = (itemId: number, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const addMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const newId = Math.max(...menuItems.map(item => item.id)) + 1;
    setMenuItems(prev => [...prev, { ...newItem, id: newId }]);
  };

  const deleteMenuItem = (itemId: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getTotalSales = () => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  };

  const getMostOrderedItems = () => {
    const itemCounts: { [key: string]: number } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.title] = (itemCounts[item.title] || 0) + item.quantity;
      });
    });
    return Object.entries(itemCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[var(--rc-creamy-beige)] flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-[var(--rc-espresso-brown)] mb-2">Admin Login</h1>
            <p className="text-[var(--rc-text-secondary)]">Rapchai Café Staff Portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold text-lg hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all transform hover:scale-105"
            >
              Login
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-[var(--rc-creamy-beige)] rounded-xl">
            <p className="text-sm text-[var(--rc-text-secondary)] text-center">
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: rapchai123
            </p>
          </div>
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
            <h1 className="text-2xl font-black">Rapchai Admin Dashboard</h1>
            <p className="text-sm opacity-90">Staff Portal</p>
          </div>
          <button
            onClick={handleLogout}
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
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'reports'
                ? 'bg-[var(--rc-orange)] text-white shadow-lg'
                : 'bg-white text-[var(--rc-espresso-brown)] border-2 border-[var(--rc-espresso-brown)]/30 hover:border-[var(--rc-orange)]'
            }`}
          >
            📊 Reports
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
                        <div className="text-2xl font-black text-[var(--rc-orange)]">₹{order.totalAmount}</div>
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
                            <span>{item.title} × {item.quantity}</span>
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
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[var(--rc-espresso-brown)]">Menu Management</h2>
              <button className="px-6 py-3 bg-[var(--rc-orange)] text-white rounded-xl font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors">
                + Add New Item
              </button>
            </div>

            <div className="grid gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[var(--rc-orange)]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)]">{item.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          item.veg ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {item.veg ? 'Veg' : 'Non-Veg'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--rc-creamy-beige)] text-[var(--rc-espresso-brown)]">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-2xl font-black text-[var(--rc-orange)]">₹{item.price}</div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateMenuItem(item.id, { available: !item.available })}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                          item.available
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {item.available ? 'Available' : 'Out of Stock'}
                      </button>
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-200 transition-colors">
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteMenuItem(item.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold text-sm hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[var(--rc-espresso-brown)]">Daily Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Orders */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[var(--rc-orange)]/20">
                <div className="text-center">
                  <div className="text-4xl font-black text-[var(--rc-orange)] mb-2">{orders.length}</div>
                  <div className="text-lg font-bold text-[var(--rc-espresso-brown)]">Total Orders</div>
                  <div className="text-sm text-[var(--rc-text-secondary)]">Today</div>
                </div>
              </div>

              {/* Total Sales */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[var(--rc-orange)]/20">
                <div className="text-center">
                  <div className="text-4xl font-black text-[var(--rc-orange)] mb-2">₹{getTotalSales()}</div>
                  <div className="text-lg font-bold text-[var(--rc-espresso-brown)]">Total Sales</div>
                  <div className="text-sm text-[var(--rc-text-secondary)]">Today</div>
                </div>
              </div>

              {/* Average Order Value */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[var(--rc-orange)]/20">
                <div className="text-center">
                  <div className="text-4xl font-black text-[var(--rc-orange)] mb-2">
                    ₹{orders.length > 0 ? Math.round(getTotalSales() / orders.length) : 0}
                  </div>
                  <div className="text-lg font-bold text-[var(--rc-espresso-brown)]">Avg Order Value</div>
                  <div className="text-sm text-[var(--rc-text-secondary)]">Today</div>
                </div>
              </div>
            </div>

            {/* Most Ordered Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[var(--rc-orange)]/20">
              <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-4">Most Ordered Items</h3>
              {getMostOrderedItems().length > 0 ? (
                <div className="space-y-3">
                  {getMostOrderedItems().map(([itemName, count], index) => (
                    <div key={itemName} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--rc-orange)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-[var(--rc-espresso-brown)]">{itemName}</span>
                      </div>
                      <span className="font-bold text-[var(--rc-orange)]">{count} orders</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--rc-text-secondary)] text-center py-8">No orders yet to analyze.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
