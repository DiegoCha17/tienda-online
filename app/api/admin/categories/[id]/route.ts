import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { isValidAdminToken } from "@/lib/admin-auth";
type Params = { params: Promise<{ id: string }> };
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const isAuthenticated = isValidAdminToken(_req.headers.get("cookie")?.match(/(?:^|;\s*)admin_auth=([^;]+)/)?.[1]);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const categoryId = Number(id);
    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
    const categoryRows =
      await sql` SELECT name FROM categories WHERE id = ${categoryId} `;
    if (categoryRows.length === 0) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 },
      );
    }
    const categoryName = categoryRows[0].name;
    if (categoryName === "General") {
      return NextResponse.json(
        { error: "No se puede eliminar la categoría General" },
        { status: 400 },
      );
    }
    await sql` UPDATE products SET category = 'General' WHERE category = ${categoryName} `;
    await sql` DELETE FROM categories WHERE id = ${categoryId} `;
    revalidateTag("categories", "max");
    revalidateTag("products", "max");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la categoría" },
      { status: 500 },
    );
  }
}
