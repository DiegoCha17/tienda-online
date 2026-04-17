"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import HeroCarousel from "./HeroCarousel";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
};

type Props = { initialProducts: Product[]; categories: string[] };

export default function StoreFront({ initialProducts, categories }: Props) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  
  // Synchronize URL category with state
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory("Todas");
    }
  }, [urlCategory]);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const filteredProducts = initialProducts.filter((p) => {
    const matchesCategory =
      selectedCategory === "Todas" ||
      (p.category || "General") === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [visibleCount, setVisibleCount] = useState(24);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, searchTerm]);

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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
            Productos
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 transition-colors">
          Encuentra la mejor calidad al mejor precio. Explora nuestra amplia
          selección con estilo.
        </p>
        <div className="max-w-3xl mx-auto flex flex-col mb-10 gap-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
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
        {/* Selector de Vista (Grid vs Compact) */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-50/50 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-gray-200 ">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${viewMode === "grid" ? "bg-gray-50 text-indigo-600 shadow-md scale-105" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 "}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span>Detallado</span>
            </button>
            <button
              onClick={() => setViewMode("compact")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${viewMode === "compact" ? "bg-gray-50 text-indigo-600 shadow-md scale-105" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 "}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span>Compacto</span>
            </button>
          </div>
        </div>
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
            className={`grid gap-6 sm:gap-8 transition-all duration-500 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"}`}
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompact={viewMode === "compact"}
              />
            ))}
          </div>
          
          {visibleCount < filteredProducts.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="px-8 py-3 bg-gray-100 text-gray-700 border border-gray-200 font-bold rounded-full hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                Cargar más productos
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
