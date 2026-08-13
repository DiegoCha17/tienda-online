import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ScrollToTop from "@/components/ScrollToTop";
import { STORE_DESCRIPTION, STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";

export default function StoreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1 pt-24 sm:pt-28">{children}</main>
      <ScrollToTop />
      <footer className="mt-16 bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-black tracking-tight text-white">{STORE_NAME}</Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">{STORE_DESCRIPTION} Calidad y servicio para cada compra.</p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Explora</h2>
            <nav className="mt-4 grid gap-3 text-sm">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <Link href="/#catalogo" className="hover:text-white">Productos</Link>
              <Link href="/favoritos" className="hover:text-white">Favoritos</Link>
              <Link href="/carrito" className="hover:text-white">Carrito</Link>
              <Link href="/about" className="hover:text-white">Sobre nosotros</Link>
            </nav>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Contacto</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              <p className="flex gap-2"><MapPin className="h-4 w-4 text-indigo-400" /> San José, Costa Rica</p>
              <p className="flex gap-2"><Phone className="h-4 w-4 text-indigo-400" /> +506 {WHATSAPP_NUMBER}</p>
              <p className="flex gap-2"><Mail className="h-4 w-4 text-indigo-400" /> info@mitienda.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
