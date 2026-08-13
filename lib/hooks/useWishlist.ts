"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Product } from "@/lib/types";

const WISHLIST_STORAGE_KEY = "wishlist";
const WISHLIST_UPDATED_EVENT = "wishlist-updated";

/** Lee los favoritos de localStorage */
function readWishlist(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Guarda los favoritos en localStorage y notifica */
function writeWishlist(wishlist: Product[]): void {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));
}

let wishlistSnapshot: Product[] = typeof window !== "undefined" ? readWishlist() : [];

function getSnapshot(): Product[] {
  return wishlistSnapshot;
}

const emptySnapshot: Product[] = [];
function getServerSnapshot(): Product[] {
  return emptySnapshot;
}

function subscribe(callback: () => void): () => void {
  const handler = () => {
    wishlistSnapshot = readWishlist();
    callback();
  };

  window.addEventListener(WISHLIST_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(WISHLIST_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useWishlist() {
  const wishlist = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleWishlist = useCallback((product: Product) => {
    const current = readWishlist();
    const exists = current.find((p) => p.id === product.id);
    
    if (exists) {
      const updated = current.filter((p) => p.id !== product.id);
      writeWishlist(updated);
      return { added: false };
    } else {
      current.push(product);
      writeWishlist(current);
      return { added: true };
    }
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    const current = readWishlist();
    const updated = current.filter((p) => p.id !== id);
    writeWishlist(updated);
  }, []);

  const isInWishlist = useCallback(
    (id: number) => {
      return wishlist.some((p) => p.id === id);
    },
    [wishlist]
  );

  return {
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
  } as const;
}
