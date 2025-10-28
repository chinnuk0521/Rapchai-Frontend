"use client";
import { useState } from "react";
import Image from "next/image";
import { IMG } from "../lib/images";

type MenuItem = { id: number; title: string; veg: boolean; price: number; category: string };
type OrderItem = MenuItem & { quantity: number };

interface OrderModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ item, isOpen, onClose }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    specialInstructions: ''
  });
  const [step, setStep] = useState<'type' | 'details' | 'payment'>('type');

  const totalAmount = item.price * quantity;
  const whatsappNumber = "8179299096";

  const handleOrderTypeSelect = (type: 'dine-in' | 'takeaway') => {
    setOrderType(type);
    setStep('details');
  };

  const handleDetailsSubmit = () => {
    setStep('payment');
  };

  const generateWhatsAppMessage = () => {
    const orderDetails = `
🍽️ *NEW ORDER - RAPCHAI CAFÉ*

📋 *Order Details:*
• Item: ${item.title}
• Quantity: ${quantity}
• Price per item: ₹${item.price}
• Total Amount: ₹${totalAmount}
• Order Type: ${orderType === 'dine-in' ? 'Dine In' : 'Takeaway'}

👤 *Customer Details:*
• Name: ${customerInfo.name}
• Phone: ${customerInfo.phone}
${orderType === 'takeaway' ? `• Address: ${customerInfo.address}` : ''}
${customerInfo.specialInstructions ? `• Special Instructions: ${customerInfo.specialInstructions}` : ''}

💰 *Payment:*
• Amount: ₹${totalAmount}
• Payment Method: UPI (via UPI app)

---
*Order placed via Rapchai Website*
*Time: ${new Date().toLocaleString('en-IN')}*`;

    return encodeURIComponent(orderDetails);
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setQuantity(1);
    setOrderType(null);
    setCustomerInfo({ name: '', phone: '', address: '', specialInstructions: '' });
    setStep('type');
    onClose();
  };

  const handleUPIPayment = () => {
    // Generate UPI payment link
    const upiId = `${whatsappNumber}@paytm`; // You can change this to your preferred UPI ID
    const upiUrl = `upi://pay?pa=${upiId}&am=${totalAmount}&cu=INR&tn=Rapchai%20Cafe%20Order%20-%20${item.title}`;
    
    // Try to open UPI app
    window.location.href = upiUrl;
    
    // Fallback: Show UPI details
    setTimeout(() => {
      alert(`UPI Payment Details:
Amount: ₹${totalAmount}
UPI ID: ${upiId}
Note: Rapchai Cafe Order - ${item.title}

Please complete payment and then proceed with WhatsApp order.`);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[var(--rc-espresso-brown)]">Order Now</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Item Details */}
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden">
              <Image
                src={IMG.burger} // You can map this based on item category
                alt={item.title}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[var(--rc-espresso-brown)] text-lg">{item.title}</h3>
              <p className="text-sm text-[var(--rc-text-secondary)] mb-2">{item.category} • {item.veg ? 'Veg' : 'Non-Veg'}</p>
              <div className="text-xl font-black text-[var(--rc-orange)]">₹{item.price}</div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--rc-espresso-brown)]">Quantity</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-[var(--rc-orange)] text-white font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold text-[var(--rc-espresso-brown)] min-w-[3rem] text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-[var(--rc-orange)] text-white font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Step 1: Order Type */}
          {step === 'type' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--rc-espresso-brown)]">Choose Order Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleOrderTypeSelect('dine-in')}
                  className="p-4 rounded-xl border-2 border-[var(--rc-orange)]/30 hover:border-[var(--rc-orange)] hover:bg-[var(--rc-orange)]/5 transition-all duration-300 text-center"
                >
                  <div className="text-2xl mb-2">🍽️</div>
                  <div className="font-bold text-[var(--rc-espresso-brown)]">Dine In</div>
                  <div className="text-sm text-[var(--rc-text-secondary)]">Eat at our cafe</div>
                </button>
                <button 
                  onClick={() => handleOrderTypeSelect('takeaway')}
                  className="p-4 rounded-xl border-2 border-[var(--rc-orange)]/30 hover:border-[var(--rc-orange)] hover:bg-[var(--rc-orange)]/5 transition-all duration-300 text-center"
                >
                  <div className="text-2xl mb-2">🥡</div>
                  <div className="font-bold text-[var(--rc-espresso-brown)]">Takeaway</div>
                  <div className="text-sm text-[var(--rc-text-secondary)]">Take home</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Customer Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--rc-espresso-brown)]">Customer Details</h3>
              
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

              {orderType === 'takeaway' && (
                <div>
                  <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">Delivery Address *</label>
                  <textarea 
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors resize-none"
                    placeholder="Enter your complete address"
                    rows={3}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">Special Instructions</label>
                <textarea 
                  value={customerInfo.specialInstructions}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors resize-none"
                  placeholder="Any special requests or instructions"
                  rows={2}
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep('type')}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)] text-[var(--rc-espresso-brown)] font-bold hover:bg-[var(--rc-espresso-brown)] hover:text-white transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleDetailsSubmit}
                  disabled={!customerInfo.name || !customerInfo.phone || (orderType === 'takeaway' && !customerInfo.address)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--rc-espresso-brown)]">Payment</h3>
              
              <div className="bg-[var(--rc-creamy-beige)] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[var(--rc-espresso-brown)]">Total Amount</span>
                  <span className="text-2xl font-black text-[var(--rc-orange)]">₹{totalAmount}</span>
                </div>
                <div className="text-sm text-[var(--rc-text-secondary)]">
                  {item.title} × {quantity} = ₹{totalAmount}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleUPIPayment}
                  className="w-full p-4 rounded-xl border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">💳</div>
                  <div className="font-bold text-green-700">Pay via UPI</div>
                  <div className="text-sm text-green-600">Paytm, PhonePe, Google Pay, etc.</div>
                </button>

                <div className="text-center text-sm text-[var(--rc-text-secondary)]">
                  After payment, your order will be sent to WhatsApp
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep('details')}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)] text-[var(--rc-espresso-brown)] font-bold hover:bg-[var(--rc-espresso-brown)] hover:text-white transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleWhatsAppOrder}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Send to WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
