"use client";

import { useState } from "react";
import Image from "next/image";
import { IMG } from "../lib/images";
import { useCart } from "../lib/cart-context";
import { useOrderManagement } from "../lib/hooks";
import type { CreateOrderRequest } from "../lib/types";
import UPIPaymentModal from "./UPIPaymentModal";

export default function UnifiedCart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalAmount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  
  const { createOrder, loading } = useOrderManagement();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showUPIPayment, setShowUPIPayment] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderError, setOrderError] = useState<string>("");
  
  const UPI_ID = "8179299096@superyes";
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    tableNumber: "",
    orderType: "dine-in" as "dine-in" | "takeaway",
    address: "",
  });

  const generateWhatsAppMessage = () => {
    const orderDetails = cart
      .map(
        (item) =>
          `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`
      )
      .join("\n");

    const message = `
🍽️ *NEW ORDER - RAPCHAI CAFÉ*

📋 *Order Details:*
${orderDetails}

💰 *Total Amount: ₹${getTotalAmount()}*

👤 *Customer Details:*
• Name: ${customerInfo.name}
• Phone: ${customerInfo.phone}
• Order Type: ${customerInfo.orderType === "dine-in" ? "Dine In" : "Takeaway"}
${customerInfo.orderType === "takeaway" ? `• Address: ${customerInfo.address}` : customerInfo.tableNumber ? `• Table: ${customerInfo.tableNumber}` : ""}

---
*Order placed via Rapchai Website*
*Time: ${new Date().toLocaleString("en-IN")}*`;

    return encodeURIComponent(message);
  };

  const handleUPIPayment = () => {
    // Show UPI payment modal with app selection
    setShowUPIPayment(true);
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/918179299096?text=${message}`;
    window.open(whatsappUrl, "_blank");

    // Reset cart and form
    clearCart();
    setCustomerInfo({
      name: "",
      phone: "",
      tableNumber: "",
      orderType: "dine-in",
      address: "",
    });
    setShowCheckout(false);
    setIsCartOpen(false);
  };

  const handleApiOrder = async () => {
    setOrderError("");

    try {
      const orderData: CreateOrderRequest = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: "",
        tableNumber:
          customerInfo.orderType === "dine-in"
            ? customerInfo.tableNumber
            : undefined,
        orderType: customerInfo.orderType,
        notes: customerInfo.address || "",
        specialInstructions: "",
        items: cart.map((item) => ({
          menuItemId: item.id.toString(),
          quantity: item.quantity,
          notes: "",
        })),
      };

      const response = await createOrder(orderData);

      // Show success message
      setOrderNumber(response.order?.orderNumber || `ORD-${Date.now()}`);
      setShowOrderConfirmation(true);

      // Reset cart and form
      clearCart();
      setCustomerInfo({
        name: "",
        phone: "",
        tableNumber: "",
        orderType: "dine-in",
        address: "",
      });
      setShowCheckout(false);
      setIsCartOpen(false);
    } catch (error) {
      setOrderError(
        error instanceof Error ? error.message : "Failed to place order"
      );
    }
  };

  const generateOrderNumber = () => {
    return `ORD-${Date.now()}`;
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-40"
      >
        <div className="relative">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            />
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
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[var(--rc-espresso-brown)]">
                  Your Cart
                </h2>
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
                  <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-[var(--rc-text-secondary)]">
                    Add some delicious items to get started!
                  </p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-[var(--rc-creamy-beige)] rounded-xl"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl || IMG.burger}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[var(--rc-espresso-brown)] truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-[var(--rc-text-secondary)]">
                          ₹{item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-[var(--rc-orange)] text-white font-bold hover:bg-[var(--rc-espresso-brown)] transition-colors"
                        >
                          -
                        </button>
                        <span className="font-bold text-[var(--rc-espresso-brown)] min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
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
                      <span className="text-lg font-bold text-[var(--rc-espresso-brown)]">
                        Total
                      </span>
                      <span className="text-2xl font-black text-[var(--rc-orange)]">
                        ₹{getTotalAmount()}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowCheckout(true)}
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
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[var(--rc-espresso-brown)]">
                  Checkout
                </h2>
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
                <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-3">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setCustomerInfo((prev) => ({ ...prev, orderType: "dine-in" }))
                    }
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      customerInfo.orderType === "dine-in"
                        ? "border-[var(--rc-orange)] bg-[var(--rc-orange)]/10"
                        : "border-gray-200 hover:border-[var(--rc-orange)]"
                    }`}
                  >
                    <div className="text-xl mb-1">🍽️</div>
                    <div className="font-bold text-sm">Dine In</div>
                  </button>
                  <button
                    onClick={() =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        orderType: "takeaway",
                      }))
                    }
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      customerInfo.orderType === "takeaway"
                        ? "border-[var(--rc-orange)] bg-[var(--rc-orange)]/10"
                        : "border-gray-200 hover:border-[var(--rc-orange)]"
                    }`}
                  >
                    <div className="text-xl mb-1">🥡</div>
                    <div className="font-bold text-sm">Takeaway</div>
                  </button>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              {customerInfo.orderType === "dine-in" && (
                <div>
                  <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">
                    Table Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerInfo.tableNumber}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        tableNumber: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
                    placeholder="e.g., Table 5"
                  />
                </div>
              )}

              {customerInfo.orderType === "takeaway" && (
                <div>
                  <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors resize-none"
                    placeholder="Enter your complete address"
                    rows={3}
                    required
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-[var(--rc-creamy-beige)] rounded-xl p-4">
                <h3 className="font-bold text-[var(--rc-espresso-brown)] mb-3">
                  Order Summary
                </h3>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-sm">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--rc-espresso-brown)]">
                      Total
                    </span>
                    <span className="text-xl font-black text-[var(--rc-orange)]">
                      ₹{getTotalAmount()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {orderError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-red-600 font-semibold text-sm">{orderError}</p>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handleUPIPayment}
                className="w-full p-4 rounded-xl border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-colors text-center mb-3"
              >
                <div className="text-2xl mb-2">💳</div>
                <div className="font-bold text-green-700">
                  Pay ₹{getTotalAmount()} via UPI
                </div>
                <div className="text-sm text-green-600">
                  Select your UPI app (PhonePe, GPay, Paytm, etc.)
                </div>
              </button>

              {/* API Order Button */}
              <button
                onClick={handleApiOrder}
                disabled={
                  loading ||
                  !customerInfo.name ||
                  !customerInfo.phone ||
                  (customerInfo.orderType === "takeaway" && !customerInfo.address)
                }
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold text-lg hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              {/* WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                disabled={
                  !customerInfo.name ||
                  !customerInfo.phone ||
                  (customerInfo.orderType === "takeaway" && !customerInfo.address)
                }
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Order to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPI Payment Modal */}
      <UPIPaymentModal
        isOpen={showUPIPayment}
        onClose={() => setShowUPIPayment(false)}
        amount={getTotalAmount()}
        upiId={UPI_ID}
      />

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-[var(--rc-espresso-brown)] mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-lg font-bold text-[var(--rc-orange)] mb-2">
              Order Number: {orderNumber}
            </p>
            <p className="text-[var(--rc-text-secondary)] mb-6">
              Your order has been received and will be prepared shortly.
            </p>
            <button
              onClick={() => {
                setShowOrderConfirmation(false);
                setIsCartOpen(false);
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold text-lg hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

