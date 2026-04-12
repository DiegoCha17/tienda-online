'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  productId: number;
};

export default function DeleteProductButton({ productId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm('¿Seguro que deseas eliminar este producto?');

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar producto');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}