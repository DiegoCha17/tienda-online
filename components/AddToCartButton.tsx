"use client";
import { useState } from "react";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import type { Product } from "@/lib/types";

type Props = {
  product: Pick<Product, "id" | "name" | "price" | "image_url" | "stock">;
  className?: string;
};

export default function AddToCartButton({ product, className = "" }: Props) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) return;

    const result = addToCart(product);
    if (result.success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock <= 0}
      className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm ${
        product.stock <= 0
          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-dashed border-gray-200"
          : isAdded
          ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-95"
          : "bg-gray-900 hover:bg-black text-white shadow-gray-900/20 hover:-translate-y-1 hover:shadow-lg"
      } ${className}`}
    >
      {product.stock <= 0 ? (
        <span className="text-[10px] uppercase tracking-widest font-black">
          Agotado
        </span>
      ) : isAdded ? (
        <>
          <CheckCircle2 className="w-5 h-5 animate-bounce" />
          <span className="text-sm">Agregado</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span className="text-sm">Agregar al carrito</span>
        </>
      )}
    </button>
  );
}
