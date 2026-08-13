"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";

export default function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/carrito"
      className="relative p-2.5 bg-gray-50 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors group border border-gray-100"
    >
      <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-lg animate-fade-in shadow-red-500/30">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
