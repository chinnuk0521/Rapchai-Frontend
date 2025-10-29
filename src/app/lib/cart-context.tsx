"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { MenuItem } from "./types";

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "rapchai_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration guard
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (!isHydrated) return;

    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [isHydrated]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart, isHydrated]);

  // Listen for addToCart events from anywhere in the app
  useEffect(() => {
    if (!isHydrated) return;

    const handleAddToCart = (event: CustomEvent) => {
      const item = event.detail as MenuItem;
      addToCart(item);
    };

    window.addEventListener("addToCart", handleAddToCart as EventListener);
    return () => {
      window.removeEventListener("addToCart", handleAddToCart as EventListener);
    };
  }, [isHydrated]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      // Normalize item name (handle both 'name' and 'title')
      const normalizedItem = {
        ...item,
        name: item.name || (item as any).title || 'Unknown Item',
      };
      
      const existingItem = prev.find((cartItem) => String(cartItem.id) === String(normalizedItem.id));
      if (existingItem) {
        return prev.map((cartItem) =>
          String(cartItem.id) === String(normalizedItem.id)
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...normalizedItem, quantity: 1 }];
    });
    // Open cart after adding item
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((itemId: string | number) => {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(itemId)));
  }, []);

  const updateQuantity = useCallback((itemId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(itemId) ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const getTotalAmount = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

