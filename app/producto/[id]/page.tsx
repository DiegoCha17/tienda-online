import type { Metadata } from "next";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const products = await sql`SELECT name, description, image_url FROM products WHERE id = ${Number(id)} AND active = TRUE LIMIT 1`;
  
  if (products.length === 0) return { title: "Producto no encontrado | Mi Tienda" };
  
  const product = products[0] as any;
  
  return {
    title: `${product.name} | Mi Tienda`,
    description: product.description || `Compra ${product.name} al mejor precio en nuestra tienda.`,
    openGraph: {
      title: product.name,
      description: product.description || `Compra ${product.name} en Mi Tienda.`,
      images: [{ url: product.image_url }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Compra ${product.name} en Mi Tienda.`,
      images: [product.image_url],
    }
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const products =
    await sql` SELECT id, name, description, price, image_url, images, specifications, features, stock, category FROM products WHERE id = ${Number(id)} AND active = TRUE LIMIT 1 `;
  if (products.length === 0) {
    return notFound();
  }
  return (
    <main className="max-w-7xl mx-auto px-4 py-2 mt-4 sm:mt-6">
      <ProductDetailClient product={products[0] as any} />
    </main>
  );
}
