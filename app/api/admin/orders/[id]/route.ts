import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
type Params = { params: Promise<{ id: string }> };
export async function PUT(req: Request, { params }: Params) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const status = body.status;
    if (!status || !["pendiente", "entregado"].includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    await sql` UPDATE orders SET status = ${status} WHERE id = ${Number(id)} `;
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
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    await sql` DELETE FROM orders WHERE id = ${Number(id)} `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando pedido:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el pedido" },
      { status: 500 },
    );
  }
}
