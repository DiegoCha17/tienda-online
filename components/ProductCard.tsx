import AddToCartButton from './AddToCartButton';
import { formatCRC } from '@/lib/currency';
import Link from 'next/link';
import { Eye, ShoppingCart } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images?: string[];
  stock: number;
  category?: string;
  specifications?: Record<string, string[]> | null;
};

type Props = {
  product: Product;
  isCompact?: boolean;
};

export default function ProductCard({ product, isCompact }: Props) {
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : (product.image_url || 'https://via.placeholder.com/400');

  return (
    <div className={`group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full ${isCompact ? 'sm:rounded-3xl' : ''}`}>
      <Link href={`/producto/${product.id}`} className={`relative flex items-center justify-center overflow-hidden bg-white p-2 ${isCompact ? 'aspect-video' : 'aspect-square'}`}>
        <img
          src={displayImage}
          alt={product.name}
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
        />
        {(product.category && product.category !== 'General') && (
          <span className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black text-indigo-700 dark:text-indigo-400 shadow-lg tracking-wider uppercase">
            {product.category}
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-red-500/30 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold ring-2 ring-white/20">
            ¡Solo {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-lg ring-1 ring-white/10 tracking-widest uppercase">
            Agotado
          </span>
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
           <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
             <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
           </div>
        </div>
      </Link>
      
      <div className={`${isCompact ? 'p-4 sm:p-5' : 'p-5 sm:p-8'} flex flex-col flex-grow bg-white dark:bg-slate-900`}>
        <Link href={`/producto/${product.id}`} className="flex-grow block group/title outline-none">
          <h2 className={`${isCompact ? 'text-sm sm:text-lg' : 'text-base sm:text-2xl'} font-black text-slate-900 dark:text-white mb-2 leading-tight line-clamp-2 break-all sm:break-words group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors`}>
            {product.name}
          </h2>
          <p className={`${isCompact ? 'hidden' : 'hidden sm:block text-sm'} text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed`}>
            {product.description || 'Sin descripción disponible.'}
          </p>
          {isCompact && (
             <p className="text-[11px] text-gray-400 dark:text-slate-500 line-clamp-1 italic">
              {product.description}
             </p>
          )}
        </Link>
        
        <div className={`${isCompact ? 'mt-3 mb-3' : 'mt-4 sm:mt-6 mb-4 sm:mb-6'}`}>
          <p className={`${isCompact ? 'text-lg sm:text-2xl' : 'text-xl sm:text-3xl'} font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 break-all sm:break-words`}>
            {formatCRC(Number(product.price))}
          </p>
        </div>
        
        <div className="mt-auto space-y-3">
          {product.stock > 0 ? (
            <div className="flex flex-col gap-2">
              <Link 
                href={`/producto/${product.id}`}
                className="w-full py-3 px-4 rounded-xl font-bold border-2 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 transition-all text-sm flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Eye className="w-4 h-4" />
                Ver detalles
              </Link>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <Link
                  href={`/producto/${product.id}`}
                  className="w-full py-3 px-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Elegir opciones
                </Link>
              ) : (
                <AddToCartButton product={product} />
              )}
            </div>
          ) : (
            <button disabled className="w-full py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-bold bg-gray-100 dark:bg-slate-900/50 text-gray-400 dark:text-slate-600 cursor-not-allowed text-[10px] sm:text-base border dark:border-slate-800">
              Agotado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}