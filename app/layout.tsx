import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/ScrollToTop";
import Link from "next/link";
import { STORE_NAME, STORE_DESCRIPTION, WHATSAPP_NUMBER } from "@/lib/constants";
import { Mail, MapPin, Phone } from "lucide-react";

const outfitFont = Outfit({ variable: "--font-outfit", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${STORE_NAME} | Inicio`,
  description: STORE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${outfitFont.variable} h-full antialiased selection:bg-indigo-500/30 selection:text-indigo-900`}
    >
      <body className="min-h-full flex flex-col pt-32 pb-0 sm:pt-36 bg-white text-gray-800 font-sans transition-colors duration-300">
        <Toaster position="top-center" richColors />
        <SiteHeader />
        
        <main className="flex-grow">{children}</main>
        
        <ScrollToTop />

        <footer className="bg-gray-900 text-gray-300 mt-auto pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Brand Col */}
              <div className="space-y-4">
                <Link href="/" className="text-3xl font-black text-white tracking-tight">
                  {STORE_NAME}
                </Link>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {STORE_DESCRIPTION} Ofreciendo la mejor calidad y servicio para nuestros clientes desde el primer día.
                </p>
                <div className="flex gap-4 pt-2">
                  <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                </div>
              </div>

              {/* Links Col */}
              <div>
                <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Enlaces Rápidos</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="/" className="hover:text-indigo-400 transition-colors">Inicio</Link></li>
                  <li><Link href="/#catalogo" className="hover:text-indigo-400 transition-colors">Catálogo de Productos</Link></li>
                  <li><Link href="/carrito" className="hover:text-indigo-400 transition-colors">Tu Carrito</Link></li>
                  <li><Link href="/about" className="hover:text-indigo-400 transition-colors">Sobre Nosotros</Link></li>
                </ul>
              </div>

              {/* Contact Col */}
              <div>
                <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contacto</h3>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>123 Calle Principal, San José, Costa Rica</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>+506 {WHATSAPP_NUMBER}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>info@mitienda.com</span>
                  </li>
                </ul>
              </div>

              {/* Newsletter / Payment Col */}
              <div>
                <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Métodos de Pago</h3>
                <p className="text-sm text-gray-400 mb-4">Aceptamos transferencia bancaria, SINPE móvil y pago contra entrega.</p>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-gray-800 px-3 py-1.5 rounded text-xs font-bold border border-gray-700">SINPE</div>
                  <div className="bg-gray-800 px-3 py-1.5 rounded text-xs font-bold border border-gray-700">Efectivo</div>
                  <div className="bg-gray-800 px-3 py-1.5 rounded text-xs font-bold border border-gray-700">Transferencia</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.
              </p>
              <div className="flex gap-4 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-300">Privacidad</a>
                <a href="#" className="hover:text-gray-300">Términos</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
