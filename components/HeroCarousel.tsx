"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  {
    id: 1,
    title: "Nueva Colección de Belleza",
    subtitle: "Descubre los tonos más vibrantes de esta temporada con hasta 20% off.",
    image: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=1200&h=400",
    color: "from-fuchsia-600/90 to-purple-800/90",
  },
  {
    id: 2,
    title: "Tecnología al Mejor Precio",
    subtitle: "Equipos de última generación para tu día a día.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200&h=400",
    color: "from-blue-600/90 to-indigo-800/90",
  },
  {
    id: 3,
    title: "Renueva tu Hogar",
    subtitle: "Accesorios y detalles únicos para cada rincón de tu casa.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200&h=400",
    color: "from-emerald-600/90 to-teal-800/90",
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl mb-12 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gray-900">
            <Image
              src={BANNERS[current].image}
              alt={BANNERS[current].title}
              fill
              priority
              className="object-cover opacity-60 mix-blend-overlay"
              sizes="100vw"
            />
          </div>
          <div className={`absolute inset-0 bg-gradient-to-r ${BANNERS[current].color} opacity-80`}></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 text-white text-shadow-sm">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-5xl font-black mb-4 tracking-tight"
            >
              {BANNERS[current].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg sm:text-xl font-medium max-w-xl opacity-90 mb-8 leading-relaxed"
            >
              {BANNERS[current].subtitle}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link 
                href="/#catalogo"
                className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                Ver Colección
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Controles de Navegación */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-white opacity-100" : "w-2 bg-white opacity-50 hover:opacity-80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
