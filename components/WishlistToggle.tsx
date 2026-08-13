"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/hooks/useWishlist";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  className?: string;
  iconSize?: number;
};

export default function WishlistToggle({ product, className = "", iconSize = 20 }: Props) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  // Convertimos a boolean
  const isFav = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <button
      onClick={handleToggle}
      className={`absolute z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:scale-110 transition-transform active:scale-95 ${className}`}
      aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart 
        size={iconSize} 
        className={`transition-colors ${isFav ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-rose-500"}`} 
      />
    </button>
  );
}
