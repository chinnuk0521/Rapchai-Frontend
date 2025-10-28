"use client";
import { useState, useEffect } from "react";
import CustomerMenu from "../../components/CustomerMenu";
import CustomerCart from "../../components/CustomerCart";
import QRCodeGenerator from "../../components/QRCodeGenerator";

type MenuItem = { id: number; title: string; veg: boolean; price: number; category: string; available: boolean };

// Sample menu data - this would come from your database
const SAMPLE_MENU: MenuItem[] = [
  { id: 1, title: "Masala Chai", veg: true, price: 79, category: "Chai/Coffee", available: true },
  { id: 2, title: "Filter Coffee", veg: true, price: 89, category: "Chai/Coffee", available: true },
  { id: 3, title: "Cold Coffee", veg: true, price: 99, category: "Chai/Coffee", available: true },
  { id: 4, title: "Mini Burger – Classic", veg: true, price: 149, category: "Mini Burgers", available: true },
  { id: 5, title: "Mini Burger – Chicken", veg: false, price: 169, category: "Mini Burgers", available: true },
  { id: 6, title: "Mini Burger – Beef", veg: false, price: 179, category: "Mini Burgers", available: false },
  { id: 7, title: "Paneer Sandwich", veg: true, price: 189, category: "Sandwiches", available: true },
  { id: 8, title: "Chicken Sandwich", veg: false, price: 199, category: "Sandwiches", available: true },
  { id: 9, title: "Beef Sandwich", veg: false, price: 209, category: "Sandwiches", available: true },
  { id: 10, title: "Paneer Kathi Roll", veg: true, price: 199, category: "Rolls", available: true },
  { id: 11, title: "Chicken Kathi Roll", veg: false, price: 219, category: "Rolls", available: true },
  { id: 12, title: "Tomato Soup", veg: true, price: 149, category: "Soups", available: true },
  { id: 13, title: "Chicken Soup", veg: false, price: 169, category: "Soups", available: true },
  { id: 14, title: "Rapchai Special", veg: true, price: 229, category: "Specials", available: true },
  { id: 15, title: "Chef's Special", veg: false, price: 249, category: "Specials", available: true },
  { id: 16, title: "Caesar Salad", veg: true, price: 219, category: "Salads", available: true },
  { id: 17, title: "Chicken Salad", veg: false, price: 239, category: "Salads", available: true },
  { id: 18, title: "Grilled Steak", veg: false, price: 399, category: "Steaks", available: false },
  { id: 19, title: "Chocolate Square", veg: true, price: 99, category: "Squares", available: true },
  { id: 20, title: "Butter Square", veg: true, price: 89, category: "Squares", available: true },
];

export default function CustomerOrderingPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(SAMPLE_MENU);

  // In a real app, you would fetch menu items from your API
  useEffect(() => {
    // Simulate API call
    setMenuItems(SAMPLE_MENU);
  }, []);

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

      {/* Cart Component */}
      <CustomerCart items={menuItems} />

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
