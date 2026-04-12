import AddToCartButton from './AddToCartButton';
import { formatCRC } from '@/lib/currency';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category?: string;
};

type Props = {
  product: Product;
  isCompact?: boolean;
};

export default function ProductCard({ product, isCompact }: Props) {
  return (
    <div className={`group bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm border border-gray-100 dark:border-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full ${isCompact ? 'sm:rounded-2xl' : ''}`}>
      <div className={`relative overflow-hidden bg-gray-50 dark:bg-slate-900 ${isCompact ? 'aspect-video' : 'aspect-square'}`}>
        <img
          src={product.image_url || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {(product.category && product.category !== 'General') && (
          <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-gray-800 dark:text-slate-200 shadow-sm border dark:border-slate-700">
            {product.category}
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500/90 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-sm ring-2 ring-red-500/20">
            ¡Solo {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gray-800/90 dark:bg-slate-800/90 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-sm ring-1 ring-white/10">
            Agotado
          </span>
        )}
      </div>
      
      <div className={`${isCompact ? 'p-3 sm:p-4' : 'p-4 sm:p-6'} flex flex-col flex-grow`}>
        <div className="flex-grow">
          <h2 className={`${isCompact ? 'text-[13px] sm:text-base' : 'text-sm sm:text-xl'} font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight line-clamp-2`}>
            {product.name}
          </h2>
          <p className={`${isCompact ? 'hidden' : 'hidden sm:block text-sm'} text-gray-500 dark:text-slate-400 line-clamp-2`}>
            {product.description || 'Sin descripción disponible.'}
          </p>
          {isCompact && (
             <p className="text-[11px] text-gray-400 dark:text-slate-500 line-clamp-1 italic">
              {product.description}
             </p>
          )}
        </div>
        
        <div className={`${isCompact ? 'mt-2 mb-2' : 'mt-3 sm:mt-6 mb-3 sm:mb-4'}`}>
          <p className={`${isCompact ? 'text-base sm:text-xl' : 'text-lg sm:text-2xl'} font-black text-blue-600 dark:text-blue-400`}>
            {formatCRC(Number(product.price))}
          </p>
        </div>
        
        <div className="mt-auto">
          {product.stock > 0 ? (
            <AddToCartButton product={product} />
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