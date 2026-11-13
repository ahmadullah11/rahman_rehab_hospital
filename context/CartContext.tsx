"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ProductItem } from "@/lib/constants";

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
  product: ProductItem;
}

interface CartContextType {
  cart: CartItem[];
  items: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  addItem: (product: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("verdant_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("verdant_cart", JSON.stringify(items));
      } catch (e) {
        console.error(e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (product: any, quantity = 1) => {
    const prodId = product._id;
    setItems((prev) => {
      const existing = prev.find((i) => i._id === prodId);
      if (existing) {
        return prev.map((i) =>
          i._id === prodId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      const cartItem: CartItem = {
        _id: prodId,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category || "General",
        quantity,
        product: product as ProductItem,
      };
      return [...prev, cartItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart: items,
        items,
        addToCart: addItem,
        addItem,
        removeFromCart: removeItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems: totalCount,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
