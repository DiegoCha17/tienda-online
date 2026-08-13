import { sql } from "@/lib/db";
import AdminOrderTable from "@/components/AdminOrderTable";
import type { Order, OrderItem } from "@/lib/types";

async function getOrders() {
  return sql`SELECT id, customer_name, customer_email, customer_phone, customer_address, total, status, created_at FROM orders ORDER BY created_at DESC`;
}

async function getOrderItems(orderId: number) {
  return sql`SELECT product_name, product_price, quantity, subtotal FROM order_items WHERE order_id = ${orderId} ORDER BY id ASC`;
}

export default async function AdminPedidosPage() {
  const rawOrders = (await getOrders()) as unknown as Omit<Order, "items">[];
  const ordersWithItems = await Promise.all(rawOrders.map(async (order) => ({
    ...order,
    items: (await getOrderItems(order.id)) as unknown as OrderItem[],
  })));

  return (
    <section>
      <div className="mb-8"><p className="text-sm font-semibold text-indigo-600">Operaciones</p><h1 className="mt-1 text-3xl font-black tracking-tight">Pedidos</h1><p className="mt-2 text-slate-500">Consulta clientes, productos y estado de cada orden.</p></div>
      <AdminOrderTable orders={ordersWithItems} />
    </section>
  );
}
