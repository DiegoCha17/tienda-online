import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await req.json();
    const { name, description, price, image_url, stock } = body;
    if (!name || !price) {
      return NextResponse.json(
        { error: "Nombre y precio son obligatorios" },
        { status: 400 },
      );
    }
    await sql` INSERT INTO products ( name, description, price, image_url, stock, active ) VALUES ( ${name}, ${description || ""}, ${price}, ${image_url || ""}, ${stock || 0}, TRUE ) `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creando producto:", error);
    return NextResponse.json(
      { error: "No se pudo crear el producto" },
      { status: 500 },
    );
  }
}
export async function GET() {
  try {
    const products =
      await sql` SELECT id, name, description, price, image_url, stock, category FROM products WHERE active = TRUE ORDER BY id DESC `;
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error cargando productos:", error);
    return NextResponse.json(
      { error: "Error al cargar productos" },
      { status: 500 },
    );
  }
}
