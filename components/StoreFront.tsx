"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import HeroCarousel from "./HeroCarousel";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";
import { ShieldCheck, SlidersHorizontal, Sparkles, Truck } from "lucide-react";
import type { Product } from "@/lib/types";

type Props = { initialProducts: Product[] };

type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

export default function StoreFront({ initialProducts }: Props) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  
  const selectedCategory = urlCategory || "Todas";
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(24);
  const [showFilters, setShowFilters] = useState(false);
  
  // Rango de precios
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

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
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      
      {/* Hero Marketing Banner */}
      <div className="mb-10">
        <HeroCarousel />
      </div>

      <section className="mb-14 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3" aria-label="Beneficios de la tienda">
        {[
          [Sparkles, "Selección cuidada", "Productos elegidos para tu día a día"],
          [ShieldCheck, "Compra con confianza", "Precios y stock validados al comprar"],
          [Truck, "Atención cercana", "Estamos disponibles cuando nos necesites"],
        ].map(([Icon, title, description]) => {
          const BenefitIcon = Icon as typeof Sparkles;
          return <div key={title as string} className="flex items-start gap-3 bg-white px-5 py-5 sm:px-6"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><BenefitIcon className="h-5 w-5" /></span><div><p className="text-sm font-bold text-slate-900">{title as string}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description as string}</p></div></div>;
        })}
      </section>

      <section id="catalogo" className="scroll-mt-28 rounded-[2rem] bg-gradient-to-br from-[#f4f1ff] via-[#f8f7ff] to-[#eef5ff] px-4 py-7 ring-1 ring-indigo-100/70 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Compra con intención</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">Encuentra algo que te encante</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Explora nuestra selección y descubre productos pensados para acompañarte.</p></div>
          <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-slate-500 ring-1 ring-indigo-100">{filteredProducts.length} productos</span>
        </div>
        
        {/* Search Bar */}
        <div className="mb-5 flex max-w-3xl flex-col gap-6 sm:mb-6">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="block min-h-12 w-full rounded-2xl border border-white/80 bg-white/85 py-3 pl-12 pr-4 text-base font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:rounded-full sm:py-4 sm:pl-14"
              placeholder="¿Qué estás buscando hoy?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


        {/* Tools Bar (Filters & Sorting) */}
        <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/75 p-3 shadow-sm backdrop-blur sm:p-4 lg:flex-row lg:items-center lg:justify-between">
          
          <div className="flex w-full flex-wrap items-center justify-between gap-3 lg:w-auto lg:justify-start">
            <button 
              onClick={() => setShowFilters(!showFilters)}
               className={`flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${showFilters ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filtros {showFilters ? 'activos' : ''}
            </button>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:w-auto">
            
            {/* View Mode */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex-none ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Detallado
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex-none ${viewMode === "compact" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Compacto
              </button>
            </div>

            {/* Sorting */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="min-h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-500 sm:w-auto sm:min-w-[190px]"
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
           <div className="mb-7 flex flex-col items-stretch gap-4 rounded-2xl border border-indigo-100/80 bg-white/60 p-4 sm:flex-row sm:items-center sm:p-5">
             <div className="grid w-full grid-cols-[auto_1fr_auto_1fr] items-center gap-2 sm:w-auto">
               <label className="col-span-4 text-xs font-black uppercase tracking-widest text-slate-500 sm:col-span-1">Rango</label>
               <input 
                 type="number" 
                 placeholder={`Min (₡)`} 
                 value={minPrice}
                 onChange={e => setMinPrice(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-indigo-500 sm:w-28"
               />
                <span className="text-center font-bold text-slate-400">-</span>
               <input 
                 type="number" 
                 placeholder={`Max (₡)`} 
                 value={maxPrice}
                 onChange={e => setMaxPrice(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-indigo-500 sm:w-28"
               />
             </div>
             {(minPrice || maxPrice) && (
               <button 
                 onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                  className="min-h-10 text-left text-xs font-bold uppercase tracking-widest text-indigo-600 transition hover:text-indigo-800 sm:ml-auto"
               >
                 Limpiar
               </button>
             )}
          </div>
        )}
       {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/60 px-5 py-16 text-center">
           <div className="mb-4 text-5xl">⌕</div>
           <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
            No hay productos que coincidan
          </h3>
           <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Intenta buscar con otras palabras o selecciona otra categoría.
          </p>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-4 sm:gap-5 transition-all duration-500 ${
              viewMode === "grid" 
                ? "grid-cols-1 min-[420px]:grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            }`}
          >
             {visibleProducts.length === 0
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
          
          {visibleCount < filteredProducts.length && (
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
      </section>
     </div>
  );
}
