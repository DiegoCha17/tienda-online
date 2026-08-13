import StoreFront from "@/components/StoreFront";
import { sql } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import { OrganizationJsonLd } from "@/components/JsonLd";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

// Caché de la DB para evitar saturación (revalida cada 60 segundos)
const getCachedProducts = unstable_cache(
  async () => {
    return await sql`SELECT id, name, description, price, image_url, images, specifications, stock, category, active FROM products WHERE active = TRUE ORDER BY id DESC`;
  },
  ['active-products'],
  { revalidate: 60, tags: ['products'] }
);

export default async function HomePage() {
  const products = await getCachedProducts();
  const categoriesSet = new Set(
    products.map((p: any) => p.category || "General"),
  );
  const categories = Array.from(categoriesSet) as string[];
  
  return (
    <>
      <OrganizationJsonLd />
      <Suspense 
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
             <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
             </div>
          </div>
        }
      >
        <StoreFront
          initialProducts={products as any}
          categories={categories.sort()}
        />
      </Suspense>
    </>
  );
}
