import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { formatCRC } from "@/lib/currency";
import { Package, ShoppingBag, AlertTriangle, TrendingUp, Users, DollarSign } from "lucide-react";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";
  
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  // Fetch metrics
  try {
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    const lowStock = await sql`SELECT COUNT(*) as count FROM products WHERE stock <= 5 AND active = TRUE`;
    const orders = await sql`SELECT COUNT(*) as count, SUM(total) as revenue FROM orders`;
    const recentOrders = await sql`SELECT id, customer_name, total, created_at, status FROM orders ORDER BY created_at DESC LIMIT 5`;

    const totalProducts = products[0]?.count || 0;
    const lowStockProducts = lowStock[0]?.count || 0;
    const totalOrders = orders[0]?.count || 0;
    const totalRevenue = orders[0]?.revenue || 0;

    return (
      <main className="max-w-7xl mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard General</h1>
            <p className="text-gray-500 font-medium">Bienvenido de vuelta, administrador.</p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="bg-white border border-gray-200 text-gray-700 hover:text-red-600 hover:bg-red-50 hover:border-red-100 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-100 p-3 rounded-2xl">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Ingresos</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{formatCRC(Number(totalRevenue))}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Total histórico</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-100 p-3 rounded-2xl">
                <ShoppingBag className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Pedidos</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{totalOrders}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Órdenes recibidas</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Catálogo</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{totalProducts}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Productos en sistema</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-100 p-3 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase">Atención</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{lowStockProducts}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Productos con stock bajo (≤5)</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-black text-gray-900">Acciones Rápidas</h2>
            <div className="flex flex-col gap-4">
              <Link
                href="/admin/productos"
                className="bg-indigo-600 text-white p-6 rounded-3xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 group"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="bg-white/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-black text-lg">Gestión de Catálogo</h3>
                </div>
                <p className="text-indigo-100 text-sm">Crear, editar o eliminar productos e inventario.</p>
              </Link>
              
              <Link
                href="/admin/pedidos"
                className="bg-gray-900 text-white p-6 rounded-3xl hover:bg-black transition-colors shadow-lg shadow-gray-900/20 group"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="bg-white/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-black text-lg">Ver Pedidos</h3>
                </div>
                <p className="text-gray-400 text-sm">Revisar los últimos pedidos y contactar clientes.</p>
              </Link>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-900">Últimos 5 Pedidos</h2>
                <Link href="/admin/pedidos" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Ver todos &rarr;
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th>
                      <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                      <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                      <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 text-sm font-bold text-gray-900">#{order.id}</td>
                        <td className="py-4 text-sm font-medium text-gray-700">{order.customer_name}</td>
                        <td className="py-4 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-sm font-black text-gray-900 text-right">
                          {formatCRC(Number(order.total))}
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-400 font-medium">
                          No hay pedidos recientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <main className="max-w-7xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error cargando el dashboard</h2>
          <p>No se pudieron obtener las métricas de la base de datos.</p>
        </div>
      </main>
    );
  }
}
