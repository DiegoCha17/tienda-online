import { sql } from "@/lib/db";
import AdminProductTable from "./AdminProductTable";
import type { Product } from "@/lib/types";
async function getCategories() {
  const rows =
    await sql` SELECT DISTINCT category FROM products ORDER BY category ASC `;
  return rows.map((row) => row.category).filter((category): category is string => Boolean(category));
}
async function getProducts() {
  return (await sql` SELECT id, name, description, price, image_url, images, specifications, features, stock, category, active FROM products ORDER BY id DESC `) as unknown as Product[];
}
export default async function AdminProductList() {
  const categories = await getCategories();
  const products = await getProducts();
  return <AdminProductTable products={products} categories={categories} />;
}
