"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const BANNERS = [
  { id: 1, eyebrow: "Selección de temporada", title: "Pequeños detalles, grandes momentos", subtitle: "Encuentra productos elegidos para hacer más especial tu día.", image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=1200&h=700", color: "from-slate-950/95 via-slate-900/65 to-indigo-900/20" },
  { id: 2, eyebrow: "Tecnología para tu ritmo", title: "Lo que necesitas, más cerca", subtitle: "Explora novedades prácticas para trabajar, crear y disfrutar.", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200&h=700", color: "from-slate-950/95 via-indigo-950/65 to-indigo-900/20" },
  { id: 3, eyebrow: "Haz tu espacio tuyo", title: "Renueva tu hogar con intención", subtitle: "Accesorios y piezas que combinan funcionalidad y personalidad.", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200&h=700", color: "from-slate-950/95 via-emerald-950/65 to-emerald-900/20" },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const banner = BANNERS[current];
  const next = () => setCurrent((value) => (value + 1) % BANNERS.length);
  const prev = () => setCurrent((value) => (value - 1 + BANNERS.length) % BANNERS.length);

  useEffect(() => {
    const timer = setInterval(next, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-slate-950 shadow-xl sm:rounded-[2rem]" aria-label="Promociones destacadas">
      <div className="relative min-h-[27rem] sm:min-h-[29rem] lg:min-h-[30rem]">
        <AnimatePresence mode="wait">
          <motion.div key={banner.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
            <Image src={banner.image} alt="" fill priority={current === 0} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px" className="object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.color}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="relative flex h-full max-w-3xl flex-col justify-center px-6 py-16 text-white sm:px-10 sm:py-14 lg:px-16 lg:py-16">
              <motion.div initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-200"><Sparkles className="h-4 w-4" /> {banner.eyebrow}</span><h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl">{banner.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">{banner.subtitle}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/#catalogo" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 font-bold text-slate-950 transition hover:bg-indigo-50">Ver productos</Link><Link href="/#catalogo" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 font-bold text-white transition hover:bg-white/10">Explorar catálogo</Link></div></motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute right-5 top-5 flex gap-2 sm:right-8 sm:top-8"><button type="button" onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur transition hover:bg-white/20" aria-label="Banner anterior"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur transition hover:bg-white/20" aria-label="Banner siguiente"><ChevronRight className="h-5 w-5" /></button></div>
        <div className="absolute bottom-6 right-6 flex items-center gap-2 sm:right-10">{BANNERS.map((item, index) => <button type="button" key={item.id} onClick={() => setCurrent(index)} className={`h-2 rounded-full transition-all ${index === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`} aria-label={`Mostrar banner ${index + 1}`} aria-current={index === current} />)}</div>
      </div>
    </section>
  );
}
