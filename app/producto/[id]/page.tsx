import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  
  const products = await sql`
    SELECT id, name, description, price, image_url, images, specifications, features, stock, category
    FROM products
    WHERE id = ${Number(id)} AND active = TRUE
    LIMIT 1
  `;

  if (products.length === 0) {
    return notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 mt-16 sm:mt-24">
      <ProductDetailClient product={products[0] as any} />
    </main>
  );
}
