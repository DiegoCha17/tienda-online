import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import AdminOrderTable from '@/components/AdminOrderTable';

async function getOrders() {
  const orders = await sql`
    SELECT
      id,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      total,
      status,
      created_at
    FROM orders
    ORDER BY created_at DESC
  `;

  return orders;
}

async function getOrderItems(orderId: number) {
  const items = await sql`
    SELECT
      product_name,
      product_price,
      quantity,
      subtotal
    FROM order_items
    WHERE order_id = ${orderId}
    ORDER BY id ASC
  `;

  return items;
}

export default async function AdminPedidosPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const rawOrders = await getOrders();
  
  const ordersWithItems = await Promise.all(
    rawOrders.map(async (order: any) => {
      const items = await getOrderItems(order.id);
      return {
        ...order,
        items
      };
    })
  );

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Administración</h1>

        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
             className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <AdminNav current="pedidos" />

      <AdminOrderTable orders={ordersWithItems as any} />
    </main>
  );
}