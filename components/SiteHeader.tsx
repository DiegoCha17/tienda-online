import Link from "next/link";
import CartIcon from "./CartIcon";
import WishlistIcon from "./WishlistIcon";
import MobileMenuClient from "./MobileMenuClient";
import { sql } from "@/lib/db";

import { unstable_cache } from "next/cache";

const getCategories = unstable_cache(
  async () => {
    try {
      const products = await sql`SELECT DISTINCT category FROM products WHERE active = TRUE`;
      const categoriesSet = new Set(products.map((p: any) => p.category || "General"));
      return Array.from(categoriesSet).sort() as string[];
    } catch (error) {
      console.error("Error fetching categories for header:", error);
      return [];
    }
  },
  ['header-categories'],
  { revalidate: 3600, tags: ['categories'] }
);

export default async function SiteHeader() {
  const categories = await getCategories();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-3xl font-black text-gray-900 tracking-tight transform transition-transform hover:scale-105"
            >
              Mi Tienda
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-black font-semibold text-lg py-2 transition-colors outline-none"
            >
              Inicio
            </Link>
            
            <div className="relative group">
              <button
                className="text-gray-600 hover:text-black font-semibold text-lg py-2 transition-colors outline-none flex items-center gap-1"
              >
                Categorías
                <svg className="w-4 h-4 mt-0.5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left scale-95 group-hover:scale-100">
                <div className="py-2">
                  <Link
                    href="/"
                    className="block px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                  >
                    Ver todas
                  </Link>
                  <div className="border-t border-gray-50 my-1"></div>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/?category=${encodeURIComponent(cat)}`}
                      className="block px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
          
          <div className="flex items-center gap-4 sm:gap-6 text-gray-700">
            <button className="hidden sm:block hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <WishlistIcon />
            <CartIcon />
            {/* Hamburger menu for mobile devices */}
            <MobileMenuClient categories={categories} />
          </div>
        </div>
      </div>
    </header>
  );
}
