'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Category = {
  id: number;
  name: string;
};

export default function AdminCategoryManager() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (res.ok) setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Error al crear categoría');
      setName('');
      await loadCategories();
      router.refresh();
    } catch (error: any) {
      alert('No se pudo crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number, categoryName: string) => {
    if (!confirm(`¿Eliminar la categoría "${categoryName}"? Los productos pasarán a "General".`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar categoría');
      await loadCategories();
      router.refresh();
    } catch (error: any) {
      alert('No se pudo eliminar la categoría');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 dark:border-slate-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
        Gestión de Categorías
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
        <input
          type="text"
          placeholder="Nombre de la nueva categoría..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createCategory()}
          className="flex-1 w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
        />
        <button
          type="button"
          onClick={createCategory}
          disabled={loading}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm shadow-indigo-200"
        >
          {loading ? 'Guardando...' : 'Agregar Categoría'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4 flex justify-between items-center hover:bg-white dark:hover:bg-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-sm transition-all"
          >
            <span className="font-semibold text-gray-700 dark:text-slate-200">{category.name}</span>
            {category.name !== 'General' && (
              <button
                type="button"
                onClick={() => deleteCategory(category.id, category.name)}
                className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Eliminar categoría"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}