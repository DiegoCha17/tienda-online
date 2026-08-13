import AdminProductForm from "@/components/AdminProductForm";
import AdminProductList from "@/components/AdminProductList";
import AdminCategoryManager from "@/components/AdminCategoryManager";

type Props = { searchParams: Promise<{ category?: string }> };

export default async function AdminProductosPage({ searchParams }: Props) {
  await searchParams;
  return (
    <section>
      <div className="mb-8"><p className="text-sm font-semibold text-indigo-600">Catálogo</p><h1 className="mt-1 text-3xl font-black tracking-tight">Productos e inventario</h1><p className="mt-2 text-slate-500">Gestiona precios, disponibilidad y categorías desde un solo lugar.</p></div>
      <AdminCategoryManager />
      <AdminProductForm />
      <AdminProductList />
    </section>
  );
}
