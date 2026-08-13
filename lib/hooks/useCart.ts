"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { CartItem, Product } from "@/lib/types";
import { CART_STORAGE_KEY, CART_UPDATED_EVENT } from "@/lib/constants";

// ============================================
// Store externo para el carrito de compras.
// Usa useSyncExternalStore para mantener todos
// los consumidores sincronizados sin prop-drilling.
// ============================================

/** Lee el carrito de localStorage de forma segura */
function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Escribe el carrito en localStorage y notifica a todos los listeners */
function writeCart(cart: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

/** Genera un ID único para un item del carrito */
function generateCartItemId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2);
}

// --- useSyncExternalStore plumbing ---

let cartSnapshot: CartItem[] = typeof window !== "undefined" ? readCart() : [];

function getSnapshot(): CartItem[] {
  return cartSnapshot;
}

const emptyCartSnapshot: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return emptyCartSnapshot;
}

function subscribe(callback: () => void): () => void {
  const handler = () => {
    cartSnapshot = readCart();
    callback();
  };

  window.addEventListener(CART_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

// ============================================
// Hook público
// ============================================

export function useCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addToCart = useCallback(
    (
      product: Pick<Product, "id" | "name" | "price" | "image_url" | "stock" | "images">,
      selectedSpecs?: Record<string, string>
    ): { success: boolean; message: string } => {
      const currentCart = readCart();

      // Buscar item existente con mismo product id y mismas specs
      const existing = currentCart.find((item) => {
        if (item.id !== product.id) return false;
        const itemSpecs = item.selectedSpecs || {};
        const newSpecs = selectedSpecs || {};
        const keys1 = Object.keys(itemSpecs);
        const keys2 = Object.keys(newSpecs);
        if (keys1.length !== keys2.length) return false;
        return keys1.every((k) => itemSpecs[k] === newSpecs[k]);
      });

      if (existing) {
        if (existing.quantity >= product.stock) {
          return { success: false, message: "Stock máximo alcanzado." };
        }
        existing.quantity += 1;
      } else {
        const displayImage =
          product.images && product.images.length > 0
            ? product.images[0]
            : product.image_url;

        currentCart.push({
          id: product.id,
          cartItemId: generateCartItemId(),
          name: product.name,
          price: Number(product.price),
          image_url: displayImage,
          quantity: 1,
          selectedSpecs: selectedSpecs ? { ...selectedSpecs } : undefined,
        });
      }

      writeCart(currentCart);
      return { success: true, message: "¡Agregado!" };
    },
    []
  );

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number): void => {
      if (quantity < 1) return;
      const currentCart = readCart();
      const updated = currentCart.map((item) => {
        const matchId = item.cartItemId || item.id.toString();
        return matchId === cartItemId ? { ...item, quantity } : item;
      });
      writeCart(updated);
    },
    []
  );

  const removeFromCart = useCallback((cartItemId: string): void => {
    const currentCart = readCart();
    const updated = currentCart.filter((item) => {
      const matchId = item.cartItemId || item.id.toString();
      return matchId !== cartItemId;
    });
    writeCart(updated);
  }, []);

  const clearCart = useCallback((): void => {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    total,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } as const;
}
