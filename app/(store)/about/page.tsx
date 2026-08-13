import { Clock3, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";

export const metadata = {
  title: `Sobre Nosotros | ${STORE_NAME}`,
  description: "Conoce nuestra historia y cómo contactarnos.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <section className="grid overflow-hidden rounded-3xl bg-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-300">La historia detrás de la tienda</p>
          <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">Comprar también puede sentirse personal.</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">Creamos {STORE_NAME} para reunir productos útiles, bonitos y elegidos con cuidado, sin hacerte perder tiempo en el camino.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/#catalogo" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 font-bold text-slate-950 transition hover:bg-indigo-50">Conocer la colección</Link><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 font-bold text-white transition hover:bg-white/10"><Phone className="h-4 w-4" /> Hablar con nosotros</a></div>
        </div>
        <div className="relative min-h-72 bg-[radial-gradient(circle_at_30%_20%,#818cf8,transparent_32%),linear-gradient(135deg,#28346f,#111827)] p-6 sm:min-h-96 sm:p-10">
          <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-white/20 sm:h-40 sm:w-40" /><div className="absolute bottom-10 left-8 h-16 w-16 rounded-2xl border border-white/20 sm:h-24 sm:w-24" />
          <div className="absolute bottom-8 right-6 max-w-52 border-l border-indigo-200/50 pl-4 text-sm leading-6 text-indigo-100 sm:bottom-12 sm:right-12">Una selección sencilla para decisiones que sí importan.</div>
        </div>
      </section>

      <section className="grid gap-4 py-12 sm:grid-cols-3 sm:py-16">
        <div className="border-t-2 border-indigo-500 pt-4"><p className="text-3xl font-black text-slate-950">01</p><h2 className="mt-3 font-bold text-slate-900">Elegimos con criterio</h2><p className="mt-2 text-sm leading-6 text-slate-500">Priorizamos productos que aportan valor real y encajan en la vida cotidiana.</p></div>
        <div className="border-t-2 border-indigo-500 pt-4"><p className="text-3xl font-black text-slate-950">02</p><h2 className="mt-3 font-bold text-slate-900">Acompañamos tu compra</h2><p className="mt-2 text-sm leading-6 text-slate-500">Nuestro catálogo y atención están pensados para que decidas con claridad.</p></div>
        <div className="border-t-2 border-indigo-500 pt-4"><p className="text-3xl font-black text-slate-950">03</p><h2 className="mt-3 font-bold text-slate-900">Cuidamos los detalles</h2><p className="mt-2 text-sm leading-6 text-slate-500">Desde la selección hasta el contacto posterior, buscamos una experiencia cercana.</p></div>
      </section>

      <section className="grid gap-4 border-t border-slate-200 pt-10 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-6"><Phone className="h-5 w-5 text-indigo-600" /><h2 className="mt-5 font-bold text-slate-900">Atención al cliente</h2><p className="mt-2 text-sm text-slate-500">WhatsApp +506 {WHATSAPP_NUMBER}<br />info@mitienda.com</p></div>
        <div className="rounded-2xl bg-slate-50 p-6"><Clock3 className="h-5 w-5 text-indigo-600" /><h2 className="mt-5 font-bold text-slate-900">Horario</h2><p className="mt-2 text-sm leading-6 text-slate-500">Lunes a viernes, 8:00 AM a 6:00 PM.<br />Sábados, 9:00 AM a 1:00 PM.</p></div>
        <div className="rounded-2xl bg-slate-50 p-6"><MapPin className="h-5 w-5 text-indigo-600" /><h2 className="mt-5 font-bold text-slate-900">Estamos en San José</h2><p className="mt-2 text-sm leading-6 text-slate-500">Av. Principal 123, Edificio Prisma, Local 4.</p></div>
      </section>
    </div>
  );
}
