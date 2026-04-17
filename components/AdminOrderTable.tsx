"use client";

import { useState } from "react";
import { formatCRC } from "@/lib/currency";
import UpdateOrderStatusButton from "./UpdateOrderStatusButton";
import DeleteOrderButton from "./DeleteOrderButton";
import {
  ClipboardList,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

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

type Props = { orders: Order[] };

export default function AdminOrderTable({ orders }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "todos" || order.status === statusFilter;
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchLow) ||
      order.customer_email.toLowerCase().includes(searchLow) ||
      String(order.id).includes(searchLow);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-2xl">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            Registro de Pedidos ({filteredOrders.length})
          </h2>
          <p className="text-gray-500 mt-1">
            Monitorea y gestiona las órdenes de tus clientes en tiempo real.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, Nombre..."
              className="pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-blue-500 rounded-xl outline-none transition-all w-full text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="bg-gray-50 border border-transparent focus:border-blue-500 text-gray-900 rounded-xl px-4 py-3 outline-none transition-all text-sm font-bold cursor-pointer"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">⏳ Pendientes</option>
            <option value="entregado">✓ Entregados</option>
          </select>
        </div>
      </div>

      {currentOrders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500 font-bold text-lg">
            No se encontraron pedidos con estos criterios.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border-2 border-gray-50 rounded-[2rem] p-6 lg:p-8 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-10">
                {/* Info Cliente & Pedido */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="bg-gray-900 text-white font-black px-4 py-1.5 rounded-xl text-xs tracking-widest uppercase">
                      Orden #{order.id}
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${
                        order.status === "entregado"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-orange-50 text-orange-700 border-orange-100"
                      }`}
                    >
                      {order.status === "entregado"
                        ? "Entregado ✓"
                        : "Pendiente ⏳"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-900">
                          {order.customer_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 font-medium">
                          {order.customer_email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 font-medium">
                          {order.customer_phone || "No especificado"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-600 font-medium leading-relaxed">
                          {order.customer_address ||
                            "Retiro en tienda / No especificada"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500 text-xs font-bold uppercase">
                          {new Date(order.created_at).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-wrap gap-3">
                    <UpdateOrderStatusButton
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                    <DeleteOrderButton orderId={order.id} />
                  </div>
                </div>

                {/* Items del Pedido */}
                <div className="lg:w-80 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-200 pb-3">
                    Resumen de Compra
                  </h3>
                  <div className="space-y-4 mb-6 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm items-start gap-4"
                      >
                        <div className="flex gap-2">
                          <span className="font-black text-indigo-600">
                            {item.quantity}x
                          </span>
                          <span className="text-gray-700 font-medium leading-tight line-clamp-2">
                            {item.product_name}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900 whitespace-nowrap">
                          {formatCRC(Number(item.subtotal))}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Total:
                      </span>
                      <span className="text-2xl font-black text-blue-600 tracking-tight">
                        {formatCRC(Number(order.total))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 pt-10 border-t border-gray-100">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-700 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-5 py-2 rounded-xl">
                  {currentPage}
                </span>
                <span className="text-sm font-bold text-gray-400">
                  / {totalPages}
                </span>
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-700 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
