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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`group bg-gray-50 border border-gray-100 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full ${
        isCompact ? "sm:rounded-3xl" : ""
      }`}
    >
      <Link
        href={`/producto/${product.id}`}
        className={`relative flex items-center justify-center overflow-hidden bg-gray-50 p-2 ${
          isCompact ? "aspect-video" : "aspect-square"
        }`}
      >
        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm p-4"
        />
        {product.category && product.category !== "General" && (
          <span className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-gray-50/95 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black text-indigo-700 shadow-lg tracking-wider uppercase z-10">
            {product.category}
          </span>
        )}
        <WishlistToggle product={product} className="top-3 left-auto right-3 sm:top-5 sm:right-5" />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-red-500/30 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold ring-2 ring-white/20 z-10 animate-pulse">
            ¡Solo {product.stock}!
          </span>
        )}
        {product.id > 15 && product.stock > 5 && (
          <span className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold ring-2 ring-white/20 z-10">
            NUEVO
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-gray-900/90 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-lg ring-1 ring-white/10 tracking-widest uppercase z-10">
            Agotado
          </span>
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
          <div className="bg-gray-50/90 backdrop-blur-md p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </Link>
      <div
        className={`${
          isCompact ? "p-4 sm:p-5" : "p-5 sm:p-8"
        } flex flex-col flex-grow bg-gray-50`}
      >
        <Link
          href={`/producto/${product.id}`}
          className="flex-grow block group/title outline-none"
        >
          <h2
            className={`${
              isCompact ? "text-sm sm:text-lg" : "text-base sm:text-xl"
            } font-black text-gray-900 mb-2 leading-tight line-clamp-2 break-all sm:break-words group-hover/title:text-indigo-600 transition-colors`}
          >
            {product.name}
          </h2>
          <p
            className={`${
              isCompact ? "hidden" : "hidden sm:block text-sm"
            } text-gray-500 line-clamp-2 mt-1 leading-relaxed`}
          >
            {product.description || "Sin descripción disponible."}
          </p>
          {isCompact && (
            <p className="text-[11px] text-gray-400 line-clamp-1 italic">
              {product.description}
            </p>
          )}
        </Link>
        <div
          className={`${isCompact ? "mt-3 mb-3" : "mt-4 sm:mt-6 mb-4 sm:mb-6"}`}
        >
          <p
            className={`${
              isCompact ? "text-lg sm:text-2xl" : "text-xl sm:text-3xl"
            } font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 break-all sm:break-words`}
          >
            {formatCRC(Number(product.price))}
          </p>
        </div>
        <div className="mt-auto space-y-3 z-30 relative">
          {product.stock > 0 ? (
            <div className="flex flex-col gap-2">
              <Link
                href={`/producto/${product.id}`}
                className="w-full py-3 px-4 rounded-xl font-bold border-2 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all text-sm flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Eye className="w-4 h-4" /> Ver detalles
              </Link>
              {product.specifications &&
              Object.keys(product.specifications).length > 0 ? (
                <Link
                  href={`/producto/${product.id}`}
                  className="w-full py-3 px-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <ShoppingCart className="w-5 h-5" /> Elegir opciones
                </Link>
              ) : (
                <AddToCartButton product={product as any} />
              )}
            </div>
          ) : (
            <button
              disabled
              className="w-full py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed text-[10px] sm:text-base border"
            >
              Agotado
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
