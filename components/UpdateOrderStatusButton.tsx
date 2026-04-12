'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  orderId: number;
  currentStatus: string;
};

export default function UpdateOrderStatusButton({
  orderId,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const nextStatus =
    currentStatus === 'pendiente' ? 'entregado' : 'pendiente';

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar estado');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar el estado del pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleUpdate}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {loading
        ? 'Actualizando...'
        : currentStatus === 'pendiente'
        ? 'Marcar como entregado'
        : 'Marcar como pendiente'}
    </button>
  );
}