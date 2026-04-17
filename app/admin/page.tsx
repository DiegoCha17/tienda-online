import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";
  if (!isAuthenticated) {
    redirect("/admin/login");
  }
  return (
    <main className="max-w-6xl mx-auto p-6">
      {" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
        <h1 className="text-3xl font-bold">Panel de Administración</h1>{" "}
        <form action="/api/admin/logout" method="POST">
          {" "}
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {" "}
            Cerrar sesión{" "}
          </button>{" "}
        </form>{" "}
      </div>{" "}
      <div className="flex flex-wrap gap-4">
        {" "}
        <Link
          href="/admin/productos"
          className="bg-blue-600 text-white px-5 py-3 rounded"
        >
          {" "}
          Ir a Productos{" "}
        </Link>{" "}
        <Link
          href="/admin/pedidos"
          className="bg-green-600 text-white px-5 py-3 rounded"
        >
          {" "}
          Ir a Pedidos{" "}
        </Link>{" "}
      </div>{" "}
    </main>
  );
}
