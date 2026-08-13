"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/hooks/useWishlist";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

type Props = {
  product: Product;
  className?: string;
  iconSize?: number;
};

export default function WishlistToggle({ product, className = "", iconSize = 20 }: Props) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  // Convertimos a boolean
  const isFav = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWishlist(product);
    toast.success(result.added ? "Agregado a favoritos" : "Quitado de favoritos");
  };

  return (
    <button
      onClick={handleToggle}
      className={`${className.includes("inline") ? "" : "absolute z-20"} rounded-full bg-white/90 p-2 shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95 ${className.replace("inline", "")}`}
      aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart 
        size={iconSize} 
        className={`transition-colors ${isFav ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-rose-500"}`} 
      />
    </button>
  );
}
