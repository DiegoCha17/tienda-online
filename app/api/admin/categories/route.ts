import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
export async function GET() {
  try {
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
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await req.json();
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json(
        { error: "El nombre de la categoría es obligatorio" },
        { status: 400 },
      );
    }
    await sql` INSERT INTO categories (name) VALUES (${name}) `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creando categoría:", error);
    return NextResponse.json(
      { error: "No se pudo crear la categoría" },
      { status: 500 },
    );
  }
}
