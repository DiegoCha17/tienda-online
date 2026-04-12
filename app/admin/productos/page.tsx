import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import AdminProductForm from '@/components/AdminProductForm';
import AdminProductList from '@/components/AdminProductList';
import AdminCategoryManager from '@/components/AdminCategoryManager';

type Props = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function AdminProductosPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const category = params.category;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Administración</h1>

        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <AdminNav current="productos" />

      <AdminCategoryManager />
      
      <AdminProductForm />

      <AdminProductList />
    </main>
  );
}