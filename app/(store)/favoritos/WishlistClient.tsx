"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/hooks/useWishlist";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";

export default function WishlistClient() {
  const { wishlist } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3 sm:mb-10 sm:gap-4">
        <div className="rounded-2xl bg-rose-100 p-3">
          <Heart className="h-7 w-7 fill-rose-500 text-rose-500 sm:h-8 sm:w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Lista de Deseos
          </h1>
          <p className="text-sm font-medium text-slate-500 sm:text-base">
            {wishlist.length} {wishlist.length === 1 ? "producto guardado" : "productos guardados"}
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="mx-auto max-w-2xl space-y-5 rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:p-16">
          <div className="mb-5 text-6xl">♡</div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Tu lista de deseos está vacía
          </h2>
          <p className="mx-auto max-w-md text-base text-slate-500 sm:text-lg">
            Explora nuestro catálogo y guarda tus productos favoritos para comprarlos más tarde.
          </p>
          <Link
            href="/#catalogo"
            className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-slate-950 px-7 font-bold text-white shadow-lg transition hover:bg-indigo-700"
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
