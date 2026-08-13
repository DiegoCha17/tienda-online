"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import HeroCarousel from "./HeroCarousel";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";
import { SlidersHorizontal, ArrowDownAZ, ArrowDown01, ArrowUp10, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";

type Props = { initialProducts: Product[]; categories: string[] };

type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

export default function StoreFront({ initialProducts, categories }: Props) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [isClient, setIsClient] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const [showFilters, setShowFilters] = useState(false);
  
  // Rango de precios
  const allPrices = initialProducts.map(p => Number(p.price));
  const minPossiblePrice = allPrices.length ? Math.min(...allPrices) : 0;
  const maxPossiblePrice = allPrices.length ? Math.max(...allPrices) : 100000;
  
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory("Todas");
    }
  }, [urlCategory]);

  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, searchTerm, sortOption, minPrice, maxPrice]);

  let filteredProducts = initialProducts.filter((p) => {
    const matchesCategory =
      selectedCategory === "Todas" ||
      (p.category || "General") === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase());
      
    const pPrice = Number(p.price);
    const matchesMinPrice = minPrice === "" || pPrice >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || pPrice <= Number(maxPrice);
    
    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  filteredProducts = filteredProducts.sort((a, b) => {
    if (sortOption === "price_asc") return Number(a.price) - Number(b.price);
    if (sortOption === "price_desc") return Number(b.price) - Number(a.price);
    if (sortOption === "name_asc") return a.name.localeCompare(b.name);
    if (sortOption === "name_desc") return b.name.localeCompare(a.name);
    // newest (simulated by id desc)
    return b.id - a.id;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Hero Marketing Banner */}
      <div className="mb-4">
        <HeroCarousel />
      </div>

      <div id="catalogo" className="text-center mb-10 scroll-mt-36">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6 transition-colors">
          Descubre Nuestros{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 animate-pulse-slow inline-block">
            Productos
          </span>
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto flex flex-col mb-8 gap-6">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg
                className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="block w-full h-full pl-16 pr-6 py-5 border-gray-200 rounded-full text-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all outline-none border font-medium"
              placeholder="¿Qué estás buscando hoy?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


        {/* Tools Bar (Filters & Sorting) */}
        <div className="bg-white p-4 sm:p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-8 animate-fade-in flex flex-col lg:flex-row gap-6 justify-between items-center">
          
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-center lg:justify-start">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${showFilters ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filtros {showFilters ? 'activos' : ''}
            </button>
            <p className="text-gray-400 font-bold text-sm">
              Mostrando <span className="text-indigo-600">{filteredProducts.length}</span> resultados
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            
            {/* View Mode */}
            <div className="flex bg-gray-50 p-1.5 rounded-2xl shadow-inner border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-xl transition-all font-bold text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Detallado
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-4 py-2 rounded-xl transition-all font-bold text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${viewMode === "compact" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Compacto
              </button>
            </div>

            {/* Sorting */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-white border-2 border-gray-100 text-gray-700 text-sm font-bold rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 transition-colors shadow-sm cursor-pointer min-w-[200px]"
            >
              <option value="newest">✨ Más Recientes</option>
              <option value="price_asc">💰 Menor a Mayor Precio</option>
              <option value="price_desc">💎 Mayor a Menor Precio</option>
              <option value="name_asc">🔤 Nombre: A-Z</option>
              <option value="name_desc">🔤 Nombre: Z-A</option>
            </select>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 mb-8 animate-slide-up flex flex-col sm:flex-row gap-6 items-center">
             <div className="flex items-center gap-4 w-full sm:w-auto">
               <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Rango de Precio</label>
               <input 
                 type="number" 
                 placeholder={`Min (₡)`} 
                 value={minPrice}
                 onChange={e => setMinPrice(e.target.value)}
                 className="w-full sm:w-32 bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-sm outline-none focus:border-indigo-500"
               />
               <span className="text-gray-400 font-bold">-</span>
               <input 
                 type="number" 
                 placeholder={`Max (₡)`} 
                 value={maxPrice}
                 onChange={e => setMaxPrice(e.target.value)}
                 className="w-full sm:w-32 bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-sm outline-none focus:border-indigo-500"
               />
             </div>
             {(minPrice || maxPrice) && (
               <button 
                 onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                 className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors"
               >
                 Limpiar
               </button>
             )}
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl shadow-sm border border-gray-100 transition-colors">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 transition-colors">
            No hay productos que coincidan
          </h3>
          <p className="text-gray-500 mt-2 transition-colors">
            Intenta buscar con otras palabras o selecciona otra categoría.
          </p>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-6 sm:gap-8 transition-all duration-500 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            }`}
          >
            {!isClient 
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} isCompact={viewMode === "compact"} />
                ))
              : visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isCompact={viewMode === "compact"}
                    index={index}
                  />
                ))
            }
          </div>
          
          {visibleCount < filteredProducts.length && isClient && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="px-8 py-3 bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold rounded-full hover:bg-indigo-600 hover:text-white transition-all focus:outline-none focus:ring-4 focus:ring-indigo-200 shadow-sm hover:shadow-indigo-200"
              >
                Mostrar más productos
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
