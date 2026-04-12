import Link from 'next/link';
import CartIcon from './CartIcon';

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform">
              Mi Tienda
            </Link>
          </div>
          <nav className="flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 transition-colors">
              Inicio
            </Link>
            <Link href="/admin/productos" className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 transition-colors">
              Admin
            </Link>
          </nav>
          <div className="flex items-center">
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
