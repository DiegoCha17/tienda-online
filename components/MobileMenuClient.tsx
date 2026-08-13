"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Home, Menu, ShoppingBag, Tag, UserRound, X } from "lucide-react";

type Props = { categories: string[] };

export default function MobileMenuClient({ categories }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setIsOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Abrir menú" aria-expanded={isOpen} aria-controls="store-mobile-menu"><Menu className="h-5 w-5" /></button>
      <div className={`fixed inset-0 z-[60] bg-slate-950/40 transition-opacity ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={close} aria-hidden="true" />
      <aside id="store-mobile-menu" className={`fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,23rem)] flex-col bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`} aria-hidden={!isOpen}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5"><div><p className="text-lg font-black text-slate-950">Menú</p><p className="text-xs font-semibold text-slate-400">Explora la tienda</p></div><button type="button" onClick={close} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Cerrar menú"><X /></button></div>
        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Navegación móvil">
          <Link href="/" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-slate-700 hover:bg-slate-100"><Home className="h-5 w-5 text-indigo-600" /> Inicio</Link>
          <Link href="/#catalogo" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-slate-700 hover:bg-slate-100"><ShoppingBag className="h-5 w-5 text-indigo-600" /> Productos</Link>
          <Link href="/favoritos" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-slate-700 hover:bg-slate-100"><Heart className="h-5 w-5 text-rose-500" /> Favoritos</Link>
          <Link href="/about" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-slate-700 hover:bg-slate-100"><UserRound className="h-5 w-5 text-indigo-600" /> Mi cuenta / contacto</Link>
          <div className="my-4 border-t border-slate-100" />
          <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Categorías</p>
          {categories.map((category) => <Link key={category} href={`/?category=${encodeURIComponent(category)}#catalogo`} onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"><Tag className="h-4 w-4" /> {category}</Link>)}
        </nav>
        <div className="border-t border-slate-100 p-4"><Link href="/carrito" onClick={close} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 font-bold text-white transition hover:bg-indigo-700"><ShoppingBag className="h-5 w-5" /> Ver carrito</Link></div>
      </aside>
    </div>
  );
}
