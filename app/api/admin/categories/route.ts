import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { isValidAdminToken } from "@/lib/admin-auth";
export async function GET(req: Request) {
  try {
    const isAuthenticated = isValidAdminToken(req.headers.get("cookie")?.match(/(?:^|;\s*)admin_auth=([^;]+)/)?.[1]);
    if (!isAuthenticated) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const categories =
      await sql` SELECT id, name FROM categories ORDER BY name ASC `;
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar las categorías" },
      { status: 500 },
    );
  }
}
export async function POST(req: Request) {
  try {
    const isAuthenticated = isValidAdminToken(req.headers.get("cookie")?.match(/(?:^|;\s*)admin_auth=([^;]+)/)?.[1]);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await req.json();
    const name = body.name?.trim();
    if (!name || name.length > 80) {
      return NextResponse.json(
        { error: "El nombre de la categoría es obligatorio" },
        { status: 400 },
      );
    }
    const existing = await sql` SELECT id FROM categories WHERE LOWER(name) = LOWER(${name}) LIMIT 1 `;
    if (existing.length > 0) return NextResponse.json({ error: "La categoría ya existe" }, { status: 409 });
    await sql` INSERT INTO categories (name) VALUES (${name}) `;
    revalidateTag("categories", "max");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creando categoría:", error);
    return NextResponse.json(
      { error: "No se pudo crear la categoría" },
      { status: 500 },
    );
  }
}
