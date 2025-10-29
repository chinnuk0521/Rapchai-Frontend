"use client";
import { useState, useEffect } from "react";
import CustomerMenu from "../../components/CustomerMenu";
import QRCodeGenerator from "../../components/QRCodeGenerator";
import { useMenuData } from "../../lib/hooks";
import type { MenuItem } from "../../lib/types";

export default function CustomerOrderingPage() {
  const { menuItems, loading, refetch } = useMenuData();
  
  // Use API data only - no fallback to static data
  const items = menuItems;

  return (
    <div className="min-h-screen bg-[var(--rc-creamy-beige)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white py-4">
        <div className="w-[95%] mx-auto px-4 text-center">
          <h1 className="text-2xl font-black mb-2">Welcome to Rapchai Café</h1>
          <p className="text-sm opacity-90">Order Online • Pay via UPI • Enjoy Fresh Food</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[95%] mx-auto px-4 py-8">
        <CustomerMenu items={menuItems} />
      </div>

      {/* Cart Component - Now handled globally via UnifiedCart */}

      {/* QR Code Generator */}
      <QRCodeGenerator />

      {/* Footer */}
      <div className="bg-[var(--rc-espresso-brown)] text-white py-6 mt-12">
        <div className="w-[95%] mx-auto px-4 text-center">
          <h3 className="text-lg font-bold mb-2">Rapchai Café</h3>
          <p className="text-sm opacity-80 mb-4">Koramangala, Bangalore</p>
          <div className="flex justify-center gap-6 text-sm">
            <span>📱 WhatsApp: +91 8179299096</span>
            <span>💳 UPI: 8179299096@paytm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
