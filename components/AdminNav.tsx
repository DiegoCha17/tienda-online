import Link from 'next/link';

type Props = {
  current: 'productos' | 'pedidos';
};

export default function AdminNav({ current }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 flex flex-col sm:flex-row gap-2">
      <Link
        href="/admin/productos"
        className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
          current === 'productos' 
            ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
        Inventario y Productos
      </Link>

      <Link
        href="/admin/pedidos"
        className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
          current === 'pedidos' 
            ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        Registro de Pedidos
      </Link>
    </div>
  );
}