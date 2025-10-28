"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { IMG } from "../lib/images";

type MenuItem = { id: number; title: string; veg: boolean; price: number; category: string; available: boolean };
type CartItem = MenuItem & { quantity: number };

interface CustomerCartProps {
  items: MenuItem[];
}

export default function CustomerCart({ items }: CustomerCartProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    tableNumber: '',
    orderType: 'dine-in' as 'dine-in' | 'takeaway'
  });

  const addToCart = (item: MenuItem) => {
    if (!item.available) return;
    
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Listen for addToCart events
  useEffect(() => {
    const handleAddToCart = (event: CustomEvent) => {
      addToCart(event.detail);
    };

    window.addEventListener('addToCart', handleAddToCart as EventListener);
    return () => {
      window.removeEventListener('addToCart', handleAddToCart as EventListener);
    };
  }, []);

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const generateOrderNumber = () => {
    return `RC${Date.now().toString().slice(-6)}`;
  };

  const generateWhatsAppMessage = () => {
    const orderDetails = cart.map(item => 
      `• ${item.title} × ${item.quantity} = ₹${item.price * item.quantity}`
    ).join('\n');

    const message = `
🍽️ *NEW ORDER - RAPCHAI CAFÉ*
📋 *Order #${orderNumber}*

📋 *Order Details:*
${orderDetails}

💰 *Total Amount: ₹${getTotalAmount()}*

👤 *Customer Details:*
• Name: ${customerInfo.name}
• Phone: ${customerInfo.phone}
• Order Type: ${customerInfo.orderType === 'dine-in' ? 'Dine In' : 'Takeaway'}
${customerInfo.orderType === 'dine-in' ? `• Table Number: ${customerInfo.tableNumber}` : ''}

💳 *Payment Status: PAID via UPI*

---
*Order placed via Rapchai QR Code*
*Time: ${new Date().toLocaleString('en-IN')}*`;

    return encodeURIComponent(message);
  };

  const handleUPIPayment = () => {
    const upiId = `8179299096@paytm`;
    const upiUrl = `upi://pay?pa=${upiId}&am=${getTotalAmount()}&cu=INR&tn=Rapchai%20Order%20${orderNumber}`;
    
    // Try to open UPI app
    window.location.href = upiUrl;
    
    // After payment, show confirmation
    setTimeout(() => {
      setShowOrderConfirmation(true);
      setShowCheckout(false);
    }, 2000);
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/918179299096?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset cart and form
    setCart([]);
    setCustomerInfo({ name: '', phone: '', tableNumber: '', orderType: 'dine-in' });
    setShowCheckout(false);
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
    setShowCheckout(true);
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-40"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </div>
      </button>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[var(--rc-espresso-brown)]">Your Cart</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-2">Your cart is empty</h3>
                  <p className="text-[var(--rc-text-secondary)]">Scan the QR code and add some delicious items!</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-[var(--rc-creamy-beige)] rounded-xl">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={IMG.burger}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[var(--rc-espresso-brown)]">{item.title}</h3>
                        <p className="text-sm text-[var(--rc-text-secondary)]">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-[var(--rc-orange)] text-white font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors"
                        >
                          -
                        </button>
                        <span className="font-bold text-[var(--rc-espresso-brown)] min-w-[2rem] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-[var(--rc-orange)] text-white font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-[var(--rc-espresso-brown)]">Total</span>
                      <span className="text-2xl font-black text-[var(--rc-orange)]">₹{getTotalAmount()}</span>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold text-lg hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all transform hover:scale-105"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[var(--rc-espresso-brown)]">Checkout</h2>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="p-6 space-y-6">
              {/* Order Type */}
              <div>
                <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-3">Order Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCustomerInfo(prev => ({ ...prev, orderType: 'dine-in' }))}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      customerInfo.orderType === 'dine-in'
                        ? 'border-[var(--rc-orange)] bg-[var(--rc-orange)]/10'
                        : 'border-gray-200 hover:border-[var(--rc-orange)]'
                    }`}
                  >
                    <div className="text-xl mb-1">🍽️</div>
                    <div className="font-bold text-sm">Dine In</div>
                  </button>
                  <button 
                    onClick={() => setCustomerInfo(prev => ({ ...prev, orderType: 'takeaway' }))}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      customerInfo.orderType === 'takeaway'
                        ? 'border-[var(--rc-orange)] bg-[var(--rc-orange)]/10'
                        : 'border-gray-200 hover:border-[var(--rc-orange)]'
                    }`}
                  >
                    <div className="text-xl mb-1">🥡</div>
                    <div className="font-bold text-sm">Takeaway</div>
                  </button>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">Name *</label>
                <input 
                  type="text" 
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              {customerInfo.orderType === 'dine-in' && (
                <div>
                  <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">Table Number *</label>
                  <input 
                    type="text" 
                    value={customerInfo.tableNumber}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, tableNumber: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
                    placeholder="Enter table number"
                    required
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-[var(--rc-creamy-beige)] rounded-xl p-4">
                <h3 className="font-bold text-[var(--rc-espresso-brown)] mb-3">Order Summary</h3>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span className="text-sm">{item.title} × {item.quantity}</span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--rc-espresso-brown)]">Total</span>
                    <span className="text-xl font-black text-[var(--rc-orange)]">₹{getTotalAmount()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button 
                onClick={handleUPIPayment}
                disabled={!customerInfo.name || !customerInfo.phone || (customerInfo.orderType === 'dine-in' && !customerInfo.tableNumber)}
                className="w-full p-4 rounded-xl border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-colors text-center mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-2xl mb-2">💳</div>
                <div className="font-bold text-green-700">Pay ₹{getTotalAmount()} via UPI</div>
                <div className="text-sm text-green-600">Paytm, PhonePe, Google Pay, etc.</div>
              </button>

              {/* WhatsApp Order Button */}
              <button 
                onClick={handleWhatsAppOrder}
                disabled={!customerInfo.name || !customerInfo.phone || (customerInfo.orderType === 'dine-in' && !customerInfo.tableNumber)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Order to Kitchen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-[var(--rc-espresso-brown)] mb-4">Order Confirmed!</h2>
            <p className="text-lg font-semibold text-[var(--rc-orange)] mb-2">Order #{orderNumber}</p>
            <p className="text-[var(--rc-text-secondary)] mb-6">
              Your order has been placed! Please wait while we prepare it.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--rc-text-secondary)]">
                <div className="w-3 h-3 bg-[var(--rc-orange)] rounded-full"></div>
                <span>Order Received</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span>Preparing...</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span>Ready for Pickup</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowOrderConfirmation(false);
                setCart([]);
                setCustomerInfo({ name: '', phone: '', tableNumber: '', orderType: 'dine-in' });
                setIsCartOpen(false);
              }}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
