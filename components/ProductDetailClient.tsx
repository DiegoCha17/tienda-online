"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Ruler,
  Droplets,
  Info,
  ArrowLeft,
  CheckCircle2,
  Box,
  Truck,
  Sparkles
} from "lucide-react";
import { formatCRC } from "@/lib/currency";
import { toast } from "sonner";
import { useCart } from "@/lib/hooks/useCart";
import type { Product } from "@/lib/types";
import { ProductJsonLd } from "@/components/JsonLd";

type Props = { product: Product };

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const allImages = Array.from(
    new Set([product.image_url, ...(product.images || [])])
  ).filter(Boolean);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const [isAdded, setIsAdded] = useState(false);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    if (product.specifications) {
      const requiredKeys = Object.keys(product.specifications);
      const missing = requiredKeys.filter((key) => !selectedSpecs[key]);
      if (missing.length > 0) {
        toast.warning(`Selecciona: ${missing.join(", ")}`);
        return;
      }
    }

    const result = addToCart(product, selectedSpecs);
    
    if (result.success) {
      setIsAdded(true);
      toast.success(result.message);
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 animate-in fade-in duration-1000">
      <ProductJsonLd product={product} />
      {/* Botón Compacto */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-gray-400 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-lg border border-gray-100 group-hover:bg-indigo-600 group-hover:text-white transition-all scale-90 sm:scale-100">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="hidden sm:inline">Volver</span>
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Edición Especial</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-5 sm:p-8 lg:p-12 shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col lg:flex-row gap-8 lg:gap-16">
        
        {/* Galería con Glow Effect */}
        <div className="w-full lg:w-1/2 space-y-6 relative">
          <div className="absolute -inset-4 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group">
            {allImages.length > 0 ? (
              <Image
                src={allImages[currentImageIndex] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain transition-all duration-700 group-hover:scale-110 p-8"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                <Box className="w-16 h-16 mb-2 opacity-10" />
                <span className="font-bold uppercase tracking-widest text-[10px]">Sin imagen sensorial</span>
              </div>
            )}
            
            {allImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                <button
                  onClick={(e) => {e.stopPropagation(); handlePrevImage();}}
                  className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl hover:bg-white transition-all active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6 text-indigo-600" />
                </button>
                <button
                  onClick={(e) => {e.stopPropagation(); handleNextImage();}}
                  className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl hover:bg-white transition-all active:scale-90"
                >
                  <ChevronRight className="w-6 h-6 text-indigo-600" />
                </button>
              </div>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar px-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx
                      ? "border-indigo-600 scale-105 shadow-xl shadow-indigo-100 rotate-1"
                      : "border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información Técnica & Compra */}
        <div className="w-full lg:w-1/2 flex flex-col pt-0 sm:pt-4">
          <div className="flex items-center justify-end mb-4 h-6">
            <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-100" />)}
            </div>
          </div>

          <h1 className="text-4xl lg:text-7xl font-black text-gray-900 mb-6 leading-none tracking-tighter">
            {product.name}
          </h1>

          <div className="flex items-center gap-6 mb-10">
            <p className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-700 tracking-tighter">
              {formatCRC(Number(product.price))}
            </p>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed font-bold mb-10 border-l-[6px] border-indigo-600 pl-8 italic bg-indigo-50/30 py-4 py-r-4 rounded-r-3xl">
            {product.description || "Diseño y funcionalidad en su estado más puro."}
          </p>

          <div className="space-y-12">
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-10">
                {Object.entries(product.specifications).map(([key, values]) => (
                  <div key={key} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{key}</label>
                      {selectedSpecs[key] && (
                        <span className="text-[9px] font-black text-white bg-indigo-600 px-3 py-1 rounded-full uppercase">Selección: {selectedSpecs[key]}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {values.map((val) => {
                        const isSelected = selectedSpecs[key] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => setSelectedSpecs(prev => ({ ...prev, [key]: val }))}
                            className={`min-w-[4.5rem] px-8 py-4 rounded-3xl font-black text-xs transition-all border-4 ${
                              isSelected
                                ? "bg-gray-900 border-gray-900 text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] -translate-y-2"
                                : "bg-white border-gray-50 text-gray-400 hover:border-indigo-100 hover:text-indigo-600"
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

            {/* Quick Benefits Cards */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex flex-col gap-3">
                  <div className="bg-white w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center">
                    <Truck className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pago contra entrega</span>
               </div>
               <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex flex-col gap-3">
                  <div className="bg-white w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Calidad Garantizada</span>
               </div>
            </div>

            {/* Acción Final Glow */}
            <div className="relative group">
              <div className={`absolute -inset-2 bg-indigo-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-500 ${product.stock <= 0 ? 'hidden' : ''}`} />
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`w-full py-7 px-10 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all duration-500 relative ${
                  product.stock <= 0
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed border-2 border-dashed border-gray-200"
                    : isAdded
                    ? "bg-emerald-500 text-white shadow-2xl scale-95"
                    : "bg-gray-900 text-white hover:bg-black hover:-translate-y-2 active:translate-y-0"
                }`}
              >
                {product.stock <= 0 ? (
                  "SIN EXISTENCIAS"
                ) : isAdded ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                    <span>¡LISTO!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-7 h-7" />
                    <span className="tracking-tighter uppercase">Comprar ahora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción Detallada */}
      {product.features && Object.values(product.features).some(v => !!v) && (
        <div className="mt-24">
          <div className="flex flex-col items-center mb-16 text-center space-y-4 animate-slide-up">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
              Descripción del Producto
            </h2>
            <div className="flex items-center gap-4 w-full px-4">
                <div className="h-px bg-gray-100 flex-1" />
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] px-4">Especificaciones y Características</p>
                <div className="h-px bg-gray-100 flex-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Medidas Exactas Card */}
            {(product.features.height || product.features.width || product.features.length) && (
              <div className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-indigo-100 hover:-translate-y-4 transition-all duration-700 relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="bg-gray-900 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 text-white shadow-xl shadow-gray-200">
                    <Ruler className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-8">Medidas Exactas</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {product.features.height && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors">
                        <span className="text-[10px] text-gray-400 font-black uppercase">Alto</span>
                        <span className="text-gray-900 font-black text-lg">{product.features.height}</span>
                      </div>
                    )}
                    {product.features.width && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors">
                        <span className="text-[10px] text-gray-400 font-black uppercase">Ancho</span>
                        <span className="text-gray-900 font-black text-lg">{product.features.width}</span>
                      </div>
                    )}
                    {product.features.length && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors">
                        <span className="text-[10px] text-gray-400 font-black uppercase">Largo</span>
                        <span className="text-gray-900 font-black text-lg">{product.features.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Peso Estimado Card */}
            {product.features.weight && (
              <div className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-emerald-100 hover:-translate-y-4 transition-all duration-700 relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="bg-gray-900 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 text-white shadow-xl shadow-gray-200">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
                  </div>
                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-8">Peso Estimado</h4>
                  <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Peso Neto</p>
                    <p className="text-5xl font-black text-gray-900 tracking-tighter">{product.features.weight}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Textura y Acabado Card */}
            {product.features.texture && (
              <div className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-orange-100 hover:-translate-y-4 transition-all duration-700 relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="bg-gray-900 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 text-white shadow-xl shadow-gray-200">
                    <Droplets className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-8">Textura y Acabado</h4>
                  <div className="flex flex-col gap-2">
                    <p className="text-4xl font-black text-gray-900 uppercase leading-none tracking-tighter">{product.features.texture}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Acabado Final</p>
                  </div>
                </div>
              </div>
            )}

            {/* Composición Card */}
            {product.features.ingredients && (
              <div className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-teal-100 hover:-translate-y-4 transition-all duration-700 relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="bg-gray-900 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 text-white shadow-xl shadow-gray-200">
                    <Info className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-8">Composición</h4>
                  <div className="p-6 bg-teal-50/50 rounded-3xl border border-teal-100">
                    <p className="text-xs text-teal-800 font-bold leading-relaxed italic line-clamp-6">
                      {product.features.ingredients}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
