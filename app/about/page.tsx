import SiteHeader from "@/components/SiteHeader";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: `Sobre Nosotros | ${STORE_NAME}`,
  description: "Conoce nuestra historia y cómo contactarnos.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gray-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 rounded-l-[100px] blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-sm mb-4 block">Nuestra Historia</span>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-none">
                Apasionados por la <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Calidad</span>
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8">
                Desde nuestros inicios, nos hemos comprometido a ofrecer productos excepcionales que mejoran la vida de nuestros clientes. Buscamos siempre la innovación y la excelencia en cada detalle.
              </p>
              <div className="flex gap-4">
                <Link href="/#catalogo" className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl hover:-translate-y-1">
                  Ver Catálogo
                </Link>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="bg-green-50 text-green-700 hover:bg-green-100 px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Contáctanos
                </a>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="absolute inset-0 bg-indigo-200 rounded-[3rem] transform rotate-3 scale-105" />
              <div className="relative h-[400px] lg:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Nuestro Equipo" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Contacto */}
            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:shadow-xl transition-all">
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <Phone className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Atención al Cliente</h3>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li className="flex items-center gap-3">
                  <span className="font-bold">WhatsApp:</span> +506 {WHATSAPP_NUMBER}
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-bold">Email:</span> info@mitienda.com
                </li>
              </ul>
            </div>

            {/* Horario */}
            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:shadow-xl transition-all">
              <div className="bg-violet-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <Clock className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Horario de Atención</h3>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span>Lunes - Viernes</span>
                  <span className="font-bold text-gray-900">8:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span>Sábados</span>
                  <span className="font-bold text-gray-900">9:00 AM - 1:00 PM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Domingos</span>
                  <span className="font-bold text-gray-400">Cerrado</span>
                </li>
              </ul>
            </div>

            {/* Ubicación */}
            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:shadow-xl transition-all">
              <div className="bg-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <MapPin className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Ubicación Central</h3>
              <p className="text-gray-600 font-medium mb-6 leading-relaxed">
                Av. Principal 123, Edificio Prisma, Local 4.<br/>
                San José, Costa Rica.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="bg-gray-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
