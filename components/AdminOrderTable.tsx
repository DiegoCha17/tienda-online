'use client';

import { useState } from 'react';
import { formatCRC } from '@/lib/currency';
import UpdateOrderStatusButton from './UpdateOrderStatusButton';
import DeleteOrderButton from './DeleteOrderButton';

type OrderItem = {
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

type Props = {
  orders: Order[];
};

export default function AdminOrderTable({ orders }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchLow) ||
      order.customer_email.toLowerCase().includes(searchLow) ||
      String(order.id).includes(searchLow);
    
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Registro de Pedidos ({filteredOrders.length})
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por ID, Nombre o Correo..."
            className="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="entregado">Entregados</option>
          </select>
        </div>
      </div>

      {currentOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No se encontraron pedidos.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentOrders.map((order) => (
            <div key={order.id} className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gray-50/50">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                {/* Info Cliente & Pedido */}
                <div className="flex-1 space-y-2 text-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-gray-900 text-white font-bold px-3 py-1 rounded-lg text-xs tracking-wider">
                      ORDEN #{order.id}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      order.status === 'entregado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status === 'entregado' ? 'Entregado ✓' : 'Pendiente ⏳'}
                    </span>
                  </div>

                  <p><strong className="text-gray-900">Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  <p><strong className="text-gray-900">Cliente:</strong> {order.customer_name}</p>
                  <p><strong className="text-gray-900">Correo:</strong> {order.customer_email}</p>
                  <p><strong className="text-gray-900">Teléfono:</strong> {order.customer_phone || 'N/A'}</p>
                  <p><strong className="text-gray-900">Dirección:</strong> {order.customer_address || 'N/A'}</p>
                  
                  <div className="pt-4 flex gap-3">
                    <UpdateOrderStatusButton orderId={order.id} currentStatus={order.status} />
                    <DeleteOrderButton orderId={order.id} />
                  </div>
                </div>

                {/* Items del Pedido */}
                <div className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Resumen de Contenido</h3>
                  <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-600">{item.quantity}x</span>
                          <span className="text-gray-800 line-clamp-1">{item.product_name}</span>
                        </div>
                        <span className="font-medium text-gray-900">{formatCRC(Number(item.subtotal))}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="font-bold text-gray-500">Monto Total:</span>
                    <span className="text-xl font-black text-blue-600">{formatCRC(Number(order.total))}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-100">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="text-sm font-medium text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
