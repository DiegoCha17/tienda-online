'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Category = {
  id: number;
  name: string;
};

export default function AdminProductForm() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return alert('El nombre es obligatorio');

    const parsedPrice = Number(price);
    const parsedStock = Number(stock || 0);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) return alert('Ingresa un precio válido mayor a 0');
    if (Number.isNaN(parsedStock) || parsedStock < 0) return alert('Ingresa un stock válido');

    try {
      setLoading(true);
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, description, price: parsedPrice, image_url: imageUrl, stock: parsedStock, category,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Error al crear producto');
        return;
      }

      alert('¡Producto creado correctamente!');
      setName(''); setDescription(''); setPrice(''); setImageUrl(''); setStock(''); setCategory('General');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('No se pudo crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) return alert(data.error || 'Error subiendo imagen');
      setImageUrl(data.url);
    } catch (error) {
      console.error(error);
      alert('Error subiendo imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Registrar Nuevo Producto
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del producto <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none border"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none border resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Precio <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500">₡</span>
                <input
                  type="number"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border-gray-200 rounded-xl pl-8 pr-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Stock <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none border"
            >
              {categories.length === 0 ? <option value="General">General</option> : null}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Imagen del Producto</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <span className="relative rounded-md font-medium text-green-600 hover:text-green-500">
                    Sube un archivo
                  </span>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
              </div>
            </div>
          </div>

          {(uploadingImage || imageUrl) && (
            <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 bg-gray-50">
              {uploadingImage ? (
                <div className="w-16 h-16 rounded flex items-center justify-center bg-gray-200 animate-pulse">
                   <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
              ) : (
                <img src={imageUrl} alt="Vista previa" className="w-16 h-16 object-cover rounded shadow-sm border border-gray-200" />
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{uploadingImage ? 'Subiendo imagen...' : 'Imagen cargada con éxito'}</p>
                {!uploadingImage && <p className="text-xs text-green-600">Lista para publicar</p>}
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || uploadingImage}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Crear Producto
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}