'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Tag, Ruler, Droplets, Info } from 'lucide-react';
import { formatCRC } from '@/lib/currency';
import { toast } from 'sonner';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images: string[] | null;
  specifications: Record<string, string[]> | null;
  features: Record<string, string> | null;
  stock: number;
  category: string;
};

type Props = {
  product: Product;
};

export default function ProductDetailClient({ product }: Props) {
  // Combine image_url explicitly with images to form gallery
  const allImages = Array.from(new Set([
    product.image_url,
    ...(product.images || [])
  ])).filter(Boolean);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Initialize selected specs state empty
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const [isAdded, setIsAdded] = useState(false);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    // Validation: make sure all required specs are chosen
    if (product.specifications) {
      const requiredKeys = Object.keys(product.specifications);
      const missing = requiredKeys.filter((key) => !selectedSpecs[key]);
      
      if (missing.length > 0) {
        toast.warning(`Por favor selecciona: ${missing.join(', ')}`);
        return;
      }
    }

    const raw = localStorage.getItem('cart');
    const cart = raw ? JSON.parse(raw) : [];

    // Check if exactly this product+specs configuration exists
    const existing = cart.find((item: any) => {
      if (item.id !== product.id) return false;
      
      // Compare specs deeply
      const itemSpecs = item.selectedSpecs || {};
      const currentSpecs = selectedSpecs || {};
      
      const keys1 = Object.keys(itemSpecs);
      const keys2 = Object.keys(currentSpecs);
      
      if (keys1.length !== keys2.length) return false;
      return keys1.every(k => itemSpecs[k] === currentSpecs[k]);
    });

    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error('No hay suficiente stock disponible para añadir más.');
        return;
      }
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        cartItemId: Date.now().toString() + Math.random().toString(36).substring(2),
        name: product.name,
        price: Number(product.price),
        image_url: allImages[0] || product.image_url,
        quantity: 1,
        selectedSpecs: { ...selectedSpecs }
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    setIsAdded(true);
    toast.success('¡Agregado al carrito!');
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 sm:p-6 lg:p-10 shadow-xl border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Columna Izquierda: Galería */}
        <div className="space-y-4 sm:space-y-6">
          <div className="relative aspect-[4/5] sm:aspect-square rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-800">
            {allImages.length > 0 ? (
              <img
                src={allImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}

            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/50 p-3 sm:p-2 rounded-full backdrop-blur-md shadow-lg hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 dark:text-white" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/50 p-3 sm:p-2 rounded-full backdrop-blur-md shadow-lg hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 dark:text-white" />
                </button>
              </>
            )}
            
            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-red-500/20">
                ¡Solo {product.stock} disponibles!
              </span>
            )}
          </div>

          {/* Miniaturas */}
          {allImages.length > 1 && (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === idx 
                      ? 'border-indigo-500 scale-105 shadow-md' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Detalles del Producto */}
        <div className="flex flex-col">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
              <Tag className="w-3.5 h-3.5" />
              {product.category || 'General'}
            </span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
            {product.name}
          </h1>

          <p className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-6">
            {formatCRC(Number(product.price))}
          </p>

          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8 font-medium">
            {product.description || 'Sin descripción detallada disponible para este producto.'}
          </p>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-800 mb-8" />

          {/* Opciones Interactivas (Especificaciones) */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-6 mb-8">
              {Object.entries(product.specifications).map(([key, values]) => (
                <div key={key} className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    {key}: <span className="font-medium text-gray-500 ml-2">{selectedSpecs[key] || 'Por seleccionar'}</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {values.map((val) => {
                      const isSelected = selectedSpecs[key] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setSelectedSpecs(prev => ({ ...prev, [key]: val }))}
                          className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 border-2 ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/30 -translate-y-0.5' 
                              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`w-full py-4 lg:py-5 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50 ${
                product.stock <= 0 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : isAdded
                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 cursor-default scale-[0.98]'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:-translate-y-1 hover:shadow-2xl'
              }`}
            >
              {product.stock <= 0 ? (
                'PRODUCTO AGOTADO'
              ) : isAdded ? (
                <>
                  <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ¡AÑADIDO CON ÉXITO!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  AÑADIR AL CARRITO
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Ficha Técnica: Atributos físicos fijos */}
      {product.features && Object.values(product.features).some((v) => !!v) && (
        <div className="mt-12 sm:mt-16 bg-gray-50 dark:bg-slate-800/40 rounded-[2rem] p-6 lg:p-12 border border-gray-100 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 sm:mb-8 flex items-center gap-3">
            <Info className="w-6 h-6 text-indigo-500" /> Letra Menuda (Ficha Técnica)
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {(product.features.height || product.features.width || product.features.length) && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
                  <Ruler className="w-5 h-5" />
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Dimensiones</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                  {product.features.height && <li><span className="font-bold text-gray-400">Alto:</span> {product.features.height}</li>}
                  {product.features.width && <li><span className="font-bold text-gray-400">Ancho:</span> {product.features.width}</li>}
                  {product.features.length && <li><span className="font-bold text-gray-400">Largo:</span> {product.features.length}</li>}
                </ul>
              </div>
            )}

            {product.features.weight && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4 text-green-600 dark:text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Peso</h4>
                </div>
                <p className="text-gray-600 dark:text-slate-300 font-medium">
                  {product.features.weight}
                </p>
              </div>
            )}

            {product.features.texture && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4 text-orange-600 dark:text-orange-400">
                  <Droplets className="w-5 h-5" />
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Textura / Acabado</h4>
                </div>
                <p className="text-gray-600 dark:text-slate-300 font-medium">
                  {product.features.texture}
                </p>
              </div>
            )}

            {product.features.ingredients && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4 text-teal-600 dark:text-teal-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Composición</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed italic">
                  {product.features.ingredients}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
