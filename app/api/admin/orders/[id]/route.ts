import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { isValidAdminToken } from "@/lib/admin-auth";
type Params = { params: Promise<{ id: string }> };
export async function PUT(req: Request, { params }: Params) {
  try {
    const isAuthenticated = isValidAdminToken(req.headers.get("cookie")?.match(/(?:^|;\s*)admin_auth=([^;]+)/)?.[1]);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const orderId = Number(id);
    if (!Number.isSafeInteger(orderId) || orderId <= 0) return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
    const body = await req.json();
    const status = body.status;
    if (!status || !["pendiente", "entregado"].includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    const result = await sql` UPDATE orders SET status = ${status} WHERE id = ${orderId} RETURNING id `;
    if (result.length === 0) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    revalidatePath("/admin");
    revalidatePath("/admin/pedidos");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando estado del pedido:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el estado" },
      { status: 500 },
    );
  }
}
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const isAuthenticated = isValidAdminToken(_req.headers.get("cookie")?.match(/(?:^|;\s*)admin_auth=([^;]+)/)?.[1]);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const orderId = Number(id);
    if (!Number.isSafeInteger(orderId) || orderId <= 0) return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
    const result = await sql` DELETE FROM orders WHERE id = ${orderId} RETURNING id `;
    if (result.length === 0) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    revalidatePath("/admin");
    revalidatePath("/admin/pedidos");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando pedido:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el pedido" },
      { status: 500 },
    );
  }
}
