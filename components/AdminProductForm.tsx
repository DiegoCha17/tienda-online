'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Settings, 
  Tag, 
  Save, 
  Loader2, 
  PlusCircle,
  XCircle,
  LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type Category = {
  id: number;
  name: string;
};

type Spec = {
  name: string;
  values: string[];
};

const formSchema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio (min. 3 caracteres)'),
  description: z.string().optional(),
  price: z.number().min(1, 'El precio debe ser mayor a 0'),
  stock: z.number().min(0, 'El stock no puede ser negativo'),
  category: z.string().min(1, 'La categoría es requerida'),
  height: z.string().optional(),
  width: z.string().optional(),
  length: z.string().optional(),
  weight: z.string().optional(),
  ingredients: z.string().optional(),
  texture: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminProductForm() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  
  // Custom states that are complex for hook form alone
  const [images, setImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<Spec[]>([]);
  const [newSpecName, setNewSpecName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'General',
      height: '',
      width: '',
      length: '',
      weight: '',
      ingredients: '',
      texture: '',
    }
  });

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

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Error subiendo imagen');
        return;
      }
      setImages(prev => [...prev, data.url]);
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error subiendo imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    toast.info('Imagen removida');
  };

  const addSpecification = () => {
    if (!newSpecName.trim()) {
      toast.warning('Ingresa un nombre para la especificación');
      return;
    }
    setSpecifications(prev => [...prev, { name: newSpecName.trim(), values: [] }]);
    setNewSpecName('');
    toast.success('Especificación añadida');
  };

  const removeSpecification = (index: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  const addValueToSpec = (specIndex: number, value: string) => {
    if (!value.trim()) return;
    const updated = [...specifications];
    updated[specIndex].values.push(value.trim());
    setSpecifications(updated);
  };

  const removeValueFromSpec = (specIndex: number, valIndex: number) => {
    const updated = [...specifications];
    updated[specIndex].values = updated[specIndex].values.filter((_, i) => i !== valIndex);
    setSpecifications(updated);
  };

  const onSubmit = async (values: FormValues) => {
    if (images.length === 0) {
      toast.error('Debes añadir al menos una imagen');
      return;
    }

    // Convert specs array to object for DB
    const specsObject: Record<string, string[]> = {};
    specifications.forEach(s => {
      if (s.name && s.values.length > 0) {
        specsObject[s.name] = s.values;
      }
    });

    try {
      setLoading(true);
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          image_url: images[0], // First image as thumbnail
          images,
          specifications: specsObject,
          features: {
            height: values.height,
            width: values.width,
            length: values.length,
            weight: values.weight,
            ingredients: values.ingredients,
            texture: values.texture,
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al crear producto');
        return;
      }

      toast.success('¡Producto creado correctamente!');
      
      reset();
      setImages([]); 
      setSpecifications([]);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 mb-12 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 transition-all">
      <div className="flex items-center justify-between mb-10 border-b border-gray-50 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-500/10 p-2.5 rounded-2xl">
              <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            Registrar Nuevo Producto
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mt-1 ml-14">Añade productos con múltiples imágenes y variaciones detalladas.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Columna Izquierda: Información Básica */}
        <div className="space-y-8">
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Información General
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 ml-1">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Ej: Camiseta Urban Style"
                  className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-green-500 dark:focus:border-green-500/50 rounded-2xl px-6 py-4 text-gray-900 dark:text-white transition-all outline-none"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 ml-1">Descripción Detallada</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe las características principales del producto..."
                  className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-green-500 dark:focus:border-green-500/50 rounded-2xl px-6 py-4 text-gray-900 dark:text-white transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 ml-1">Precio (₡) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-green-500 dark:focus:border-green-500/50 rounded-2xl px-6 py-4 text-gray-900 dark:text-white transition-all outline-none font-mono"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1 ml-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 ml-1">Stock Inicial <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-green-500 dark:focus:border-green-500/50 rounded-2xl px-6 py-4 text-gray-900 dark:text-white transition-all outline-none font-mono"
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1 ml-1">{errors.stock.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 ml-1">Categoría</label>
                <select
                  {...register('category')}
                  className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-green-500 dark:focus:border-green-500/50 rounded-2xl px-6 py-4 text-gray-900 dark:text-white transition-all outline-none appearance-none cursor-pointer"
                >
                  {categories.length === 0 ? <option value="General">General</option> : null}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1 ml-1">{errors.category.message}</p>}
              </div>
            </div>
          </section>

          {/* Sección de Especificaciones */}
          <section className="space-y-6 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Especificaciones Extra
            </h3>
            
            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-[2rem] space-y-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSpecName}
                  onChange={(e) => setNewSpecName(e.target.value)}
                  placeholder="Ej: Talla o Color"
                  className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="bg-gray-900 dark:bg-green-600 text-white px-5 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Añadir
                </button>
              </div>

              <div className="space-y-4">
                {specifications.map((spec, sIdx) => (
                  <div key={sIdx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-black text-gray-800 dark:text-white uppercase text-xs tracking-wider">{spec.name}</span>
                      <button type="button" onClick={() => removeSpecification(sIdx)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {spec.values.map((val, vIdx) => (
                        <span key={vIdx} className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 group">
                          {val}
                          <XCircle 
                            className="w-3 h-3 cursor-pointer text-green-300 hover:text-red-500 transition-colors" 
                            onClick={() => removeValueFromSpec(sIdx, vIdx)}
                          />
                        </span>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Escribe un valor y pulsa Enter..."
                      className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500/50"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addValueToSpec(sIdx, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </div>
                ))}
                {specifications.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-4 italic">No has añadido especificaciones adicionales.</p>
                )}
              </div>
            </div>
          </section>

          {/* Sección de Ficha Técnica */}
          <section className="space-y-6 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Ficha Técnica (Opcional)
            </h3>
            
            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-[2rem] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 ml-1">Peso</label>
                  <input
                    type="text"
                    {...register('weight')}
                    placeholder="Ej: 500g, 1kg"
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 ml-1">Textura</label>
                  <input
                    type="text"
                    {...register('texture')}
                    placeholder="Ej: Suave, Rugosa"
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 ml-1">Alto</label>
                  <input
                    type="text"
                    {...register('height')}
                    placeholder="Ej: 10cm"
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 ml-1">Ancho</label>
                  <input
                    type="text"
                    {...register('width')}
                    placeholder="Ej: 5cm"
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 ml-1">Largo</label>
                  <input
                    type="text"
                    {...register('length')}
                    placeholder="Ej: 15cm"
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 ml-1">Ingredientes / Materiales</label>
                <textarea
                  {...register('ingredients')}
                  rows={2}
                  placeholder="Lista de ingredientes o composición del material..."
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-500 resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Columna Derecha: Galería de Imágenes */}
        <div className="space-y-8">
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Galería de Imágenes
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-[2rem] overflow-hidden border-2 border-gray-100 dark:border-slate-800">
                  <img src={img} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="bg-red-500 text-white p-3 rounded-2xl transform scale-75 group-hover:scale-100 transition-all hover:bg-red-600"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                      Principal
                    </div>
                  )}
                </div>
              ))}
              
              <div className="relative aspect-square border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploadingImage}
                />
                {uploadingImage ? (
                  <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                ) : (
                  <>
                    <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <PlusCircle className="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 dark:group-hover:text-slate-300">Añadir Imagen</span>
                  </>
                )}
              </div>
            </div>
            
            <p className="text-xs text-gray-400 flex items-center gap-2 px-2 italic">
              <LayoutGrid className="w-3 h-3" /> La primera imagen será usada como miniatura en la tienda.
            </p>
          </section>

          <div className="pt-10">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>PROCESANDO...</span>
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  <span>PUBLICAR PRODUCTO</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}