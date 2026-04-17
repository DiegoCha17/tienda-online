import StoreFront from "@/components/StoreFront";
import { sql } from "@/lib/db";
async function getProducts() {
  const products =
    await sql` SELECT id, name, description, price, image_url, images, specifications, stock, category FROM products WHERE active = TRUE ORDER BY id DESC `;
  return products;
}
import { Suspense } from "react";

export default async function HomePage() {
  const products = await getProducts();
  const categoriesSet = new Set(
    products.map((p: any) => p.category || "General"),
  );
  const categories = Array.from(categoriesSet) as string[];
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Cargando catálogo...</div>}>
      <StoreFront
        initialProducts={products as any}
        categories={categories.sort()}
      />
    </Suspense>
  );
}
