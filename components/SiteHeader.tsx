import Link from 'next/link';
import CartIcon from './CartIcon';

export default function SiteHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <header className="pointer-events-auto max-w-5xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-indigo-500/10 rounded-full">
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent transform hover:scale-105 transition-all outline-none">
                Mi Tienda
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold px-2 py-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
                Inicio
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <CartIcon />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
