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
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image_url || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {(product.category && product.category !== 'General') && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
            {product.category}
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
            ¡Solo {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
            Agotado
          </span>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h2>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description || 'Sin descripción disponible.'}</p>
        </div>
        
        <div className="mt-6 mb-4">
          <p className="text-2xl font-black text-blue-600">{formatCRC(Number(product.price))}</p>
        </div>
        
        <div className="mt-auto">
          {product.stock > 0 ? (
            <AddToCartButton product={product} />
          ) : (
            <button disabled className="w-full py-3 px-4 rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed">
              Sin stock disponible
            </button>
          )}
        </div>
      </div>
    </div>
  );
}