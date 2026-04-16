'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
};

type Props = {
  initialProducts: Product[];
  categories: string[];
};

export default function StoreFront({ initialProducts, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const filteredProducts = initialProducts.filter(p => {
    const matchesCategory = selectedCategory === 'Todas' || (p.category || 'General') === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 transition-colors">
          Descubre Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">Productos</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 transition-colors">
          Encuentra la mejor calidad al mejor precio. Explora nuestra amplia selección con estilo.
        </p>

        <div className="max-w-3xl mx-auto flex flex-col mb-10 gap-6">
          
          {/* Barra de bÃºsqueda */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              className="block w-full h-full pl-16 pr-6 py-5 border-slate-200 dark:border-slate-700/50 rounded-full text-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-slate-800/80 dark:text-white shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all outline-none border font-medium"
              placeholder="¿Qué estás buscando hoy?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros de Píldora */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button
              onClick={() => setSelectedCategory('Todas')}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 transform outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                selectedCategory === 'Todas' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105 hover:-translate-y-0.5' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-700'
              }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 transform outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  selectedCategory === cat ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg scale-105 hover:-translate-y-0.5' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de Vista (Grid vs Compact) */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                viewMode === 'grid' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-105' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              <span>Detallado</span>
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                viewMode === 'compact' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-105' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              <span>Compacto</span>
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800/40 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">No hay productos que coincidan</h3>
          <p className="text-gray-500 dark:text-slate-400 mt-2 transition-colors">Intenta buscar con otras palabras o selecciona otra categoría.</p>
        </div>
      ) : (
        <div className={`grid gap-6 sm:gap-8 transition-all duration-500 ${
          viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} isCompact={viewMode === 'compact'} />
          ))}
        </div>
      )}
    </div>
  );
}
