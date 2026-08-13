"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/hooks/useWishlist";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";

export default function WishlistClient() {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-rose-100 p-3 rounded-2xl">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Lista de Deseos
          </h1>
          <p className="text-gray-500 font-medium">
            {wishlist.length} {wishlist.length === 1 ? "producto guardado" : "productos guardados"}
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-[2rem] shadow-sm p-16 text-center space-y-6 border border-gray-100 animate-slide-up max-w-3xl mx-auto">
          <div className="text-8xl mb-6">💔</div>
          <h2 className="text-3xl font-bold text-gray-800">
            Tu lista de deseos está vacía
          </h2>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Explora nuestro catálogo y guarda tus productos favoritos para comprarlos más tarde.
          </p>
          <Link
            href="/#catalogo"
            className="inline-block mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/30"
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-slide-up">
          {wishlist.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
