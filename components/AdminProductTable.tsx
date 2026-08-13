"use client";

import { useState, useRef, useEffect } from "react";
import DeleteProductButton from "./DeleteProductButton";
import EditProductButton from "./EditProductButton";
import { formatCRC } from "@/lib/currency";
import { Package, Search, Filter, ChevronDown, Check } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images?: string[] | null;
  specifications?: Record<string, string[]> | null;
  features?: Record<string, string> | null;
  stock: number;
  category?: string;
  active?: boolean;
};

type Props = { products: Product[]; categories: string[] };

export default function AdminProductTable({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory
      ? (p.category || "General") === selectedCategory
      : true;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 mb-8 shadow-2xl shadow-gray-200/40 border border-gray-100 mt-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
              <Package className="w-7 h-7 text-white" />
            </div>
            Inventario de Productos
            <span className="ml-2 bg-gray-100 text-gray-400 text-sm font-black px-4 py-1 rounded-full">{filteredProducts.length}</span>
          </h2>
          <p className="text-gray-400 font-medium text-sm sm:text-base pl-1">
            Gestión inteligente de catálogo, stock y precios activos.
          </p>
        </div>

        <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-4">
          {/* Custom Search Bar */}
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-[1.5rem] outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Modern Filter Section */}
      <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Categoría Filtrada</p>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-4 bg-white border-2 border-gray-100 px-6 py-4 rounded-[1.5rem] shadow-sm hover:border-indigo-500 hover:shadow-md transition-all min-w-[240px]"
          >
            <div className="bg-indigo-50 p-2 rounded-xl">
              <Filter className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="flex-1 text-left font-black text-gray-700 text-sm">
              {selectedCategory || "Todas las categorías"}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(null); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${!selectedCategory ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  Todas las categorías
                  {!selectedCategory && <Check className="w-4 h-4" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setIsOpen(false); }}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    {cat}
                    {selectedCategory === cat && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {selectedCategory && (
          <button 
            onClick={() => setSelectedCategory(null)}
            className="mt-6 sm:mt-0 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
          >
            Limpiar Filtro
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-50">
            <Package className="w-10 h-10 text-gray-200" />
          </div>
          <p className="text-gray-400 font-black text-xl mb-2 uppercase tracking-tight">Sin resultados</p>
          <p className="text-gray-300 text-sm font-bold">Intenta ajustar tu búsqueda o filtros.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-6 sm:px-0">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] w-1/3">
                    Producto & Referencia
                  </th>
                  <th className="py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Categoría
                  </th>
                  <th className="py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Precio & Stock
                  </th>
                  <th className="py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Estado
                  </th>
                  <th className="py-6 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="group"
                  >
                    <td className="py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 p-2 shadow-sm group-hover:shadow-md transition-all duration-300">
                          <img
                            src={product.image_url || "https://placehold.co/100"}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors text-base">
                            {product.name}
                          </p>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-0.5">
                            ID: #{product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-gray-50 text-gray-500 uppercase tracking-widest border border-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="py-6">
                      <p className="font-black text-gray-900 text-base">
                        {formatCRC(Number(product.price))}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-orange-500" : "bg-red-500"}`} />
                        <p className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 10 ? "text-emerald-600" : product.stock > 0 ? "text-orange-500" : "text-red-500"}`}>
                          {product.stock} DISPONIBLES
                        </p>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        product.active 
                          ? "bg-emerald-50/30 text-emerald-600 border-emerald-100/50" 
                          : "bg-red-50/30 text-red-600 border-red-100/50"
                      }`}>
                        {product.active ? "Activo" : "Inactivo"}
                      </div>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap opacity-100 transition-all sm:opacity-0 sm:group-hover:opacity-100">
                        <EditProductButton
                          categories={categories}
                          product={{
                            ...product,
                            description: product.description || "",
                            images: product.images || [],
                            specifications: product.specifications || {},
                            features: product.features || {},
                            category: product.category || "General",
                            active: product.active ?? false,
                          }}
                        />
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
