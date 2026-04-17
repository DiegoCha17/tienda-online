"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl mb-12 group">
      {BANNERS.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="absolute inset-0 bg-gray-900">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
          </div>
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-80`}></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 text-white text-shadow-sm">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight transform translate-y-0 transition-transform duration-700 delay-100">
              {banner.title}
            </h2>
            <p className="text-lg sm:text-xl font-medium max-w-xl opacity-90 mb-8 leading-relaxed">
              {banner.subtitle}
            </p>
            <div>
              <Link 
                href="/#catalogo"
                className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                Ver Colección
              </Link>
            </div>
          </div>
        </div>
      ))}
      
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
