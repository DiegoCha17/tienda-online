"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Menu, Home, Grid, ChevronRight, ShoppingBag } from "lucide-react";

type Props = {
  categories: string[];
};

export default function MobileMenuClient({ categories }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Hamburger Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-gray-700 hover:text-black transition-colors focus:outline-none"
        aria-label="Abrir menú"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Side Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          {/* Header of Menu */}
          <div className="flex justify-between items-center mb-10">
            <span className="text-xl font-black text-gray-900 tracking-tight">Menú de Tienda</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Links */}
          <nav className="space-y-6">
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-3 rounded-2xl text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all font-bold group"
              >
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
                  <Home className="w-5 h-5" />
                </div>
                Inicio
              </Link>
            </div>

            {/* Categories Section */}
            <div>
              <p className="px-3 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Nuestras Categorías
              </p>
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-semibold group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      <Grid className="w-5 h-5" />
                    </div>
                    Catálogo Completo
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
                
                <div className="h-px bg-gray-100 my-2 mx-3" />

                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/?category=${encodeURIComponent(cat)}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all font-medium group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-indigo-400 transition-colors ml-3.5" />
                      {cat}
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer Area inside menu */}
          <div className="mt-auto pt-10">
            <Link
              href="/carrito"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Ver Carrito
            </Link>
            <p className="text-center text-[10px] text-gray-400 mt-6 font-medium">
              © {new Date().getFullYear()} Mi Tienda Virtual • Premium Experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
