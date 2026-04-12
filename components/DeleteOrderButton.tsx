'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  orderId: number;
};

export default function DeleteOrderButton({ orderId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(
      '¿Seguro que deseas eliminar este pedido? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar pedido');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar el pedido');
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
      {loading ? 'Eliminando...' : 'Eliminar pedido'}
    </button>
  );
}