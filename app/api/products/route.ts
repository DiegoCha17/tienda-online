import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isValidAdminToken } from "@/lib/admin-auth";
export async function POST(req: Request) {
  try {
    const isAuthenticated = isValidAdminToken(req.headers.get("cookie")?.match(/(?:^|;\s*)admin_auth=([^;]+)/)?.[1]);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await req.json();
    const { name, description, price, image_url, stock } = body;
    const parsedPrice = Number(price);
    const parsedStock = Number(stock ?? 0);
    if (typeof name !== "string" || name.trim().length < 3 || !Number.isFinite(parsedPrice) || parsedPrice <= 0 || !Number.isSafeInteger(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { error: "Nombre y precio son obligatorios" },
        { status: 400 },
      );
    }
    await sql` INSERT INTO products ( name, description, price, image_url, stock, active ) VALUES ( ${name.trim()}, ${typeof description === "string" ? description.trim() : ""}, ${parsedPrice}, ${typeof image_url === "string" ? image_url.trim() : ""}, ${parsedStock}, TRUE ) `;
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
