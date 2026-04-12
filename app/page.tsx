import StoreFront from '@/components/StoreFront';

async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('No se pudieron cargar los productos');
  }

  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();
  
  const categoriesSet = new Set(products.map((p: any) => p.category || 'General'));
  const categories = Array.from(categoriesSet) as string[];

  return <StoreFront initialProducts={products} categories={categories.sort()} />;
}