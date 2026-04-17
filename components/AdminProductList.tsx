import { sql } from "@/lib/db";
import AdminProductTable from "./AdminProductTable";
async function getCategories() {
  const rows =
    await sql` SELECT DISTINCT category FROM products ORDER BY category ASC `;
  return rows.map((row: any) => row.category).filter(Boolean);
}
async function getProducts() {
  return await sql` SELECT id, name, description, price, image_url, images, specifications, stock, category, active FROM products ORDER BY id DESC `;
}
export default async function AdminProductList() {
  const categories = await getCategories();
  const products = (await getProducts()) as any;
  return <AdminProductTable products={products} categories={categories} />;
}
