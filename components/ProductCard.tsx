import AddToCartButton from "./AddToCartButton";
import { formatCRC } from "@/lib/currency";
import Link from "next/link";
import Image from "next/image";
import { Eye, ShoppingCart } from "lucide-react";
import * as motion from "framer-motion/client";
import WishlistToggle from "./WishlistToggle";
import type { Product } from "@/lib/types";

type Props = { product: Product; isCompact?: boolean; index?: number };

export default function ProductCard({ product, isCompact, index = 0 }: Props) {
  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl ${
        isCompact ? "sm:rounded-3xl" : ""
      }`}
    >
      <Link
        href={`/producto/${product.id}`}
        className={`relative flex items-center justify-center overflow-hidden bg-slate-50 p-2 ${
          isCompact ? "aspect-[4/3]" : "aspect-[5/4]"
        }`}
      >
        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105 sm:p-6"
        />
        {product.category && product.category !== "General" && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-700 shadow-sm backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:text-[10px]">
            {product.category}
          </span>
        )}
        <WishlistToggle product={product} className="top-3 left-auto right-3 sm:top-5 sm:right-5" />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-amber-100 px-2.5 py-1 text-[9px] font-bold text-amber-800 sm:right-4 sm:top-4 sm:text-[10px]">
            ¡Solo {product.stock}!
          </span>
        )}
        {product.id > 15 && product.stock > 5 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold text-emerald-800 sm:right-4 sm:top-4 sm:text-[10px]">
            NUEVO
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-slate-950/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white sm:right-4 sm:top-4 sm:text-[10px]">
            Agotado
          </span>
        )}
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 opacity-0 transition-colors group-hover:bg-black/20 group-hover:opacity-100">
          <div className="bg-gray-50/90 backdrop-blur-md p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </Link>
      <div className={`${isCompact ? "p-3 sm:p-4" : "p-4 sm:p-5"} flex flex-grow flex-col`}>
        <Link
          href={`/producto/${product.id}`}
          className="flex-grow block group/title outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
        >
          <h2
            className={`${
              isCompact ? "text-sm sm:text-base" : "text-base sm:text-lg"
            } mb-1 line-clamp-2 break-words font-bold leading-tight text-slate-900 transition-colors group-hover/title:text-indigo-600`}
          >
            {product.name}
          </h2>
          <p
            className={`${
              isCompact ? "hidden" : "hidden sm:block text-sm"
            } mt-1 line-clamp-2 leading-relaxed text-slate-500`}
          >
            {product.description || "Sin descripción disponible."}
          </p>
          {isCompact && (
            <p className="line-clamp-1 text-[11px] italic text-slate-400">
              {product.description}
            </p>
          )}
        </Link>
        <div
            className={`${isCompact ? "mb-3 mt-3" : "mb-3 mt-4 sm:mb-4"}`}
        >
          <p
            className={`${
              isCompact ? "text-base sm:text-xl" : "text-xl sm:text-2xl"
            } font-black tracking-tight text-slate-950`}
          >
            {formatCRC(Number(product.price))}
          </p>
        </div>
          <div className="relative z-30 mt-auto">
          {product.stock > 0 ? (
            <div className="flex gap-2">
              {product.specifications &&
              Object.keys(product.specifications).length > 0 ? (
                <Link
                  href={`/producto/${product.id}`}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:text-sm"
                >
                  <ShoppingCart className="h-4 w-4" /> Elegir opciones
                </Link>
              ) : (
                <AddToCartButton product={product} className="min-h-11 flex-1 px-2 text-xs sm:text-sm" />
              )}
            </div>
          ) : (
            <button
              disabled
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-xs font-bold text-slate-400 sm:text-sm"
            >
              Agotado
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
