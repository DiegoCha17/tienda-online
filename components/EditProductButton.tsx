'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    category?: string;
    active: boolean;
  };
};

export default function EditProductButton({ product }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(String(product.price));
  const [imageUrl, setImageUrl] = useState(product.image_url || '');
  const [stock, setStock] = useState(String(product.stock));
  const [category, setCategory] = useState(product.category || 'General');
  const [active, setActive] = useState(product.active);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error subiendo imagen');
      }

      setImageUrl(data.url);
      alert('Imagen subida correctamente');
    } catch (error) {
      console.error(error);
      alert('No se pudo subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock || 0);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Ingresa un precio válido mayor a 0');
      return;
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      alert('Ingresa un stock válido');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: parsedPrice,
          image_url: imageUrl,
          stock: parsedStock,
          category,
          active,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar producto');
      }

      alert('Producto actualizado correctamente');
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Editar
      </button>

      {open && (
        <div className="mt-4 border rounded-lg p-4 bg-gray-50 w-full">
          <h3 className="text-xl font-semibold mb-3">Editar producto</h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <textarea
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              type="number"
              step="1"
              placeholder="Precio en colones"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="General">General</option>
              <option value="Ropa">Ropa</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Hogar">Hogar</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded w-full"
            />

            {uploadingImage && (
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
            )}

            {imageUrl && (
              <div>
                <p className="text-sm mb-2">Vista previa:</p>
                <img
                  src={imageUrl}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}

            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Producto activo
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading || uploadingImage}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}