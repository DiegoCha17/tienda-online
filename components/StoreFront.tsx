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
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 transition-colors">
          Descubre Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Productos</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 transition-colors">
          Encuentra la mejor calidad al mejor precio. Explora nuestra amplia selección profesional.
        </p>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
          
          {/* Barra de bÃºsqueda */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              className="block w-full h-full pl-14 pr-6 py-4 border-gray-200 dark:border-slate-700 rounded-2xl text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white shadow-sm hover:shadow-md transition-all outline-none border"
              placeholder="¿Qué estás buscando hoy?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Selector de CategorÃ­as */}
          <div className="relative w-full md:w-72 flex-shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full h-full min-h-[60px] appearance-none bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-slate-800 dark:to-slate-900 text-white py-4 px-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-blue-900/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 transition-all font-bold cursor-pointer text-lg border border-transparent dark:border-slate-700 tracking-wide"
            >
              <option value="Todas" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-semibold">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-semibold">
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-white/90">
              <svg className="fill-current h-6 w-6 drop-shadow-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Selector de Vista (Grid vs Compact) */}
        <div className="flex justify-center sm:justify-end mb-12">
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-inner">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-sm ${
                viewMode === 'grid' 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md scale-105' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              <span>Detallado</span>
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-sm ${
                viewMode === 'compact' 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md scale-105' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
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
