'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ImageIcon, PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    images?: string[] | null;
    specifications?: Record<string, string[]> | null;
    features?: Record<string, string> | null;
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
  const [features, setFeatures] = useState(product.features || {});
  
  // Use explicit array for multiple images
  const [images, setImages] = useState<string[]>(product.images || []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
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

      setImages(prev => [...prev, data.url]);
      if (!imageUrl) setImageUrl(data.url);
      
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (index === 0 && images.length > 1) {
      setImageUrl(images[1]);
    } else if (index === 0 && images.length === 1) {
      setImageUrl('');
    }
    if (selectedImageIndex >= images.length - 1) {
      setSelectedImageIndex(Math.max(0, images.length - 2));
    }
    toast.info('Imagen removida');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.warning('El nombre es obligatorio');
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock || 0);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.warning('Ingresa un precio válido mayor a 0');
      return;
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      toast.warning('Ingresa un stock válido');
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
          image_url: images.length > 0 ? images[0] : imageUrl,
          images, // Se envían todas las imágenes
          stock: parsedStock,
          category,
          active,
          features,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar producto');
      }

      toast.success('Producto actualizado correctamente');
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el producto');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto w-full h-full">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-4xl shadow-2xl relative my-8">
            <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-white flex items-center gap-3">
              Editar producto
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-4">
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
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border p-2 rounded w-full bg-white dark:bg-slate-800 outline-none focus:border-indigo-500"
            />


            {/* Ficha Técnica */}
            <div className="border-t pt-4 mt-4">
              <p className="font-bold mb-2">Ficha Técnica</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Peso"
                  value={features.weight || ''}
                  onChange={(e) => setFeatures({...features, weight: e.target.value})}
                  className="border p-2 rounded w-full text-sm"
                />
                <input
                  type="text"
                  placeholder="Textura"
                  value={features.texture || ''}
                  onChange={(e) => setFeatures({...features, texture: e.target.value})}
                  className="border p-2 rounded w-full text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Alto"
                  value={features.height || ''}
                  onChange={(e) => setFeatures({...features, height: e.target.value})}
                  className="border p-2 rounded w-full text-sm"
                />
                <input
                  type="text"
                  placeholder="Ancho"
                  value={features.width || ''}
                  onChange={(e) => setFeatures({...features, width: e.target.value})}
                  className="border p-2 rounded w-full text-sm"
                />
                <input
                  type="text"
                  placeholder="Largo"
                  value={features.length || ''}
                  onChange={(e) => setFeatures({...features, length: e.target.value})}
                  className="border p-2 rounded w-full text-sm"
                />
              </div>
              <textarea
                placeholder="Ingredientes"
                value={features.ingredients || ''}
                onChange={(e) => setFeatures({...features, ingredients: e.target.value})}
                className="border p-2 rounded w-full text-sm bg-white dark:bg-slate-800 outline-none focus:border-indigo-500"
                rows={2}
              />
              
              <label className="flex items-center gap-2 pt-4 cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600"
                />
                Producto activo en tienda
              </label>
            </div>
          </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                 Galería de Imágenes
              </h3>
              
              {/* Imagen Principal Grande */}
              <div className="relative w-full aspect-square bg-gray-50 dark:bg-slate-800 rounded-3xl border-2 border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm group">
                {images.length > 0 ? (
                  <>
                    <img src={images[selectedImageIndex]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => removeImage(selectedImageIndex)}
                        className="bg-white/90 dark:bg-black/50 backdrop-blur-md p-3 rounded-2xl shadow-lg text-red-500 hover:bg-red-500 hover:text-white transition-all hover:scale-110"
                        title="Eliminar esta imagen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {selectedImageIndex === 0 && (
                      <div className="absolute top-4 left-4 bg-indigo-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        Portada
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                    <p className="font-medium text-sm">No hay imágenes</p>
                  </div>
                )}
              </div>
              
              {/* Carrusel de Miniaturas */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === idx 
                        ? 'border-indigo-500 scale-105 shadow-md' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
                
                <div className="relative flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  ) : (
                    <>
                      <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <PlusCircle className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <span className="text-xs font-bold text-gray-400">Añadir Imagen</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-slate-800 w-full">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || uploadingImage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}