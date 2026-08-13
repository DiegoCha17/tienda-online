import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { isValidAdminToken } from "@/lib/admin-auth";
type Params = { params: Promise<{ id: string }> };
export async function DELETE(request: Request, { params }: Params) {
  try {
    const isAuthenticated = isValidAdminToken(request.headers.get("cookie")?.match(/(?:^|;\s*)admin_auth=([^;]+)/)?.[1]);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isSafeInteger(productId) || productId <= 0) return NextResponse.json({ error: "Producto inválido" }, { status: 400 });
    const result = await sql` DELETE FROM products WHERE id = ${productId} RETURNING id `;
    if (result.length === 0) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    revalidateTag("products", "max");
    revalidatePath("/");
    revalidatePath("/admin/productos");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el producto" },
      { status: 500 },
    );
  }
}
export async function PUT(req: Request, { params }: Params) {
  try {
    const isAuthenticated = isValidAdminToken(req.headers.get("cookie")?.match(/(?:^|;\s*)admin_auth=([^;]+)/)?.[1]);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isSafeInteger(productId) || productId <= 0) return NextResponse.json({ error: "Producto inválido" }, { status: 400 });
    const body = await req.json();
    const {
      name,
      description,
      price,
      image_url,
      stock,
      category,
      active,
      images,
      specifications,
      features,
    } = body;
    const parsedPrice = Number(price);
    const parsedStock = Number(stock ?? 0);
    if (typeof name !== "string" || name.trim().length < 3 || name.length > 160 || !Number.isFinite(parsedPrice) || parsedPrice <= 0 || !Number.isSafeInteger(parsedStock) || parsedStock < 0 || typeof active !== "boolean") {
      return NextResponse.json(
        { error: "Nombre y precio son obligatorios" },
        { status: 400 },
      );
    }
    const result = await sql` UPDATE products SET name = ${name.trim()}, description = ${typeof description === "string" ? description.trim() : ""}, price = ${parsedPrice}, image_url = ${typeof image_url === "string" ? image_url.trim() : ""}, stock = ${parsedStock}, category = ${typeof category === "string" && category.trim() ? category.trim() : "General"}, active = ${active}, images = ${JSON.stringify(Array.isArray(images) ? images : [])}, specifications = ${JSON.stringify(specifications && typeof specifications === "object" ? specifications : {})}, features = ${JSON.stringify(features && typeof features === "object" ? features : {})} WHERE id = ${productId} RETURNING id `;
    if (result.length === 0) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    revalidateTag("products", "max");
    revalidatePath("/");
    revalidatePath("/admin/productos");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el producto" },
      { status: 500 },
    );
  }
}
