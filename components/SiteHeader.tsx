import Link from "next/link";
import { ChevronDown, Search, UserRound } from "lucide-react";
import CartIcon from "./CartIcon";
import WishlistIcon from "./WishlistIcon";
import MobileMenuClient from "./MobileMenuClient";
import { sql } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { STORE_NAME } from "@/lib/constants";

const getCategories = unstable_cache(async () => {
  try {
    const products = await sql`SELECT DISTINCT category FROM products WHERE active = TRUE`;
    return Array.from(new Set(products.map((product) => product.category || "General"))).sort() as string[];
  } catch (error) {
    console.error("Error fetching categories for header:", error);
    return [];
  }
}, ["header-categories"], { revalidate: 3600, tags: ["categories"] });

export default async function SiteHeader() {
  const categories = await getCategories();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-xl font-black tracking-tight text-slate-950 sm:text-2xl" aria-label={`${STORE_NAME}, inicio`}>
          {STORE_NAME}
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Inicio</Link>
          <Link href="/#catalogo" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Productos</Link>
          <div className="group relative">
            <button type="button" className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-indigo-500" aria-haspopup="true">
              Categorías <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full mt-2 w-56 origin-top-left scale-95 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100">
              <Link href="/#catalogo" className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">Ver todas</Link>
              {categories.map((category) => <Link key={category} href={`/?category=${encodeURIComponent(category)}#catalogo`} className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">{category}</Link>)}
            </div>
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link href="/#catalogo" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 md:flex" aria-label="Buscar productos">
            <Search className="h-4 w-4" /> <span>Buscar productos</span>
          </Link>
          <Link href="/#catalogo" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 md:hidden" aria-label="Buscar productos"><Search className="h-5 w-5" /></Link>
          <Link href="/about" className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 sm:flex" aria-label="Mi cuenta y contacto"><UserRound className="h-5 w-5" /></Link>
          <WishlistIcon />
          <CartIcon />
          <MobileMenuClient categories={categories} />
        </div>
      </div>
    </header>
  );
}
