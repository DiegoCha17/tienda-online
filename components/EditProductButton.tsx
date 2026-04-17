"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  ImageIcon, 
  PlusCircle, 
  Loader2, 
  Settings, 
  XCircle, 
  Plus, 
  LayoutGrid,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

type Spec = { name: string; values: string[] };

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
  
  // Basic states
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price));
  const [imageUrl, setImageUrl] = useState(product.image_url || "");
  const [stock, setStock] = useState(String(product.stock));
  const [category, setCategory] = useState(product.category || "General");
  const [active, setActive] = useState(product.active);
  const [features, setFeatures] = useState(product.features || {});
  
  // Images state
  const [images, setImages] = useState<string[]>(product.images || []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Specifications state (Tallas, Colores, etc)
  const [specifications, setSpecifications] = useState<Spec[]>(
    Object.entries(product.specifications || {}).map(([name, values]) => ({
      name,
      values: values || [],
    }))
  );
  const [newSpecName, setNewSpecName] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error subiendo imagen");
      }
      setImages((prev) => [...prev, data.url]);
      if (!imageUrl) setImageUrl(data.url);
      toast.success("Imagen añadida");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (index === 0 && newImages.length > 0) {
      setImageUrl(newImages[0]);
    } else if (newImages.length === 0) {
      setImageUrl("");
    }
    if (selectedImageIndex >= newImages.length) {
      setSelectedImageIndex(Math.max(0, newImages.length - 1));
    }
    toast.info("Imagen removida");
  };

  const addSpecification = () => {
    if (!newSpecName.trim()) {
      toast.warning("Ingresa un nombre (ej: Talla)");
      return;
    }
    setSpecifications([...specifications, { name: newSpecName.trim(), values: [] }]);
    setNewSpecName("");
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
    toast.info("Especificación eliminada");
  };

  const addValueToSpec = (specIndex: number, val: string) => {
    if (!val.trim()) return;
    const updated = [...specifications];
    updated[specIndex].values.push(val.trim());
    setSpecifications(updated);
  };

  const removeValueFromSpec = (specIndex: number, valIndex: number) => {
    const updated = [...specifications];
    updated[specIndex].values = updated[specIndex].values.filter((_, i) => i !== valIndex);
    setSpecifications(updated);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.warning("Nombre obligatorio");
      return;
    }
    const parsedPrice = Number(price);
    const parsedStock = Number(stock || 0);
    
    // Convert specs to object for DB
    const specsObject: Record<string, string[]> = {};
    specifications.forEach((s) => {
      if (s.name && s.values.length > 0) {
        specsObject[s.name] = s.values;
      }
    });

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parsedPrice,
          image_url: images.length > 0 ? images[0] : imageUrl,
          images,
          stock: parsedStock,
          category,
          active,
          features,
          specifications: specsObject,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Producto actualizado correctamente");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-gray-100/80 backdrop-blur-sm text-indigo-600 font-black px-6 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
      >
        Editar
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-gray-900/40 backdrop-blur-md overflow-hidden">
          <div className="bg-white w-full sm:max-w-5xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-xl">
                    <Settings className="w-6 h-6 text-yellow-600" />
                  </div>
                  Editar Producto
                </h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Ref: {product.id}</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Info Básica */}
                <div className="space-y-8">
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5" /> Datos Generales
                    </h4>
                    
                    <div className="space-y-5">
                      <div className="relative group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Nombre del Producto</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none font-bold"
                        />
                      </div>

                      <div className="relative group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Descripción Principal</label>
                        <textarea
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none font-medium resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div className="relative">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Precio (₡)</label>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none font-black"
                          />
                        </div>
                        <div className="relative">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Stock</label>
                          <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="w-full bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none font-black"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest absolute -top-2 left-4 bg-white px-2 z-10">Categoría</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none font-bold appearance-none cursor-pointer"
                        >
                          <option value="General">General</option>
                          <option value="Ropa">Ropa</option>
                          <option value="Tecnología">Tecnología</option>
                          <option value="Accesorios">Accesorios</option>
                          <option value="Hogar">Hogar</option>
                          <option value="Belleza">Belleza</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Descripción del Producto (Ficha Técnica) */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                       Descripción del Producto
                    </h4>
                    <div className="bg-gray-50/50 p-6 rounded-3xl space-y-4 border border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          placeholder="Peso (g/kg)"
                          value={features.weight || ""}
                          onChange={(e) => setFeatures({...features, weight: e.target.value})}
                          className="bg-white border-2 border-transparent focus:border-indigo-500 px-4 py-3 rounded-xl outline-none transition-all text-sm font-bold shadow-sm"
                        />
                        <input
                          placeholder="Textura"
                          value={features.texture || ""}
                          onChange={(e) => setFeatures({...features, texture: e.target.value})}
                          className="bg-white border-2 border-transparent focus:border-indigo-500 px-4 py-3 rounded-xl outline-none transition-all text-sm font-bold shadow-sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          placeholder="Alt"
                          value={features.height || ""}
                          onChange={(e) => setFeatures({...features, height: e.target.value})}
                          className="bg-white border-2 border-transparent focus:border-indigo-500 px-3 py-2.5 rounded-xl outline-none transition-all text-xs font-bold shadow-sm"
                        />
                        <input
                          placeholder="Anc"
                          value={features.width || ""}
                          onChange={(e) => setFeatures({...features, width: e.target.value})}
                          className="bg-white border-2 border-transparent focus:border-indigo-500 px-3 py-2.5 rounded-xl outline-none transition-all text-xs font-bold shadow-sm"
                        />
                        <input
                          placeholder="Lar"
                          value={features.length || ""}
                          onChange={(e) => setFeatures({...features, length: e.target.value})}
                          className="bg-white border-2 border-transparent focus:border-indigo-500 px-3 py-2.5 rounded-xl outline-none transition-all text-xs font-bold shadow-sm"
                        />
                      </div>
                      <textarea
                        placeholder="Ingredientes / Composición del material"
                        value={features.ingredients || ""}
                        onChange={(e) => setFeatures({...features, ingredients: e.target.value})}
                        className="w-full bg-white border-2 border-transparent focus:border-indigo-500 px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium shadow-sm resize-none"
                        rows={2}
                      />
                    </div>
                  </section>
                </div>

                {/* Galería y Especificaciones Extra */}
                <div className="space-y-10">
                  {/* Imágenes */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                       Galería Visual
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-[1.5rem] overflow-hidden group shadow-sm bg-gray-50 border-2 border-gray-100/50">
                          <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button 
                              onClick={() => removeImage(idx)}
                              className="bg-red-500 text-white p-3 rounded-2xl hover:scale-110 transition-transform shadow-lg"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          {idx === 0 && (
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">Portada</div>
                          )}
                        </div>
                      ))}
                      <div className="relative aspect-square rounded-[1.5rem] border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-indigo-300 transition-all group">
                        <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploadingImage} />
                        {uploadingImage ? (
                          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        ) : (
                          <>
                            <PlusCircle className="w-8 h-8 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                            <span className="text-xs font-black text-gray-300 group-hover:text-indigo-600 mt-2 uppercase tracking-widest">Añadir</span>
                          </>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Especificaciones Pro (Tallas, Colores) */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                       Especificaciones Extra
                    </h4>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          placeholder="Nueva especificación (ej. Talla)"
                          value={newSpecName}
                          onChange={(e) => setNewSpecName(e.target.value)}
                          className="flex-1 bg-gray-50/50 border-2 border-transparent focus:border-indigo-500 px-4 py-3 rounded-2xl outline-none font-bold text-sm transition-all"
                          onKeyPress={(e) => e.key === 'Enter' && addSpecification()}
                        />
                        <button 
                          onClick={addSpecification}
                          className="bg-gray-900 text-white p-3.5 rounded-2xl hover:bg-black transition-all active:scale-95"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {specifications.map((spec, sIdx) => (
                          <div key={sIdx} className="bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black uppercase tracking-widest text-indigo-500">{spec.name}</span>
                              <button onClick={() => removeSpecification(sIdx)} className="text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {spec.values.map((v, vIdx) => (
                                <div key={vIdx} className="bg-gray-50 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-100 group">
                                  <span className="text-xs font-bold text-gray-600">{v}</span>
                                  <XCircle className="w-3.5 h-3.5 text-gray-300 cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeValueFromSpec(sIdx, vIdx)} />
                                </div>
                              ))}
                            </div>
                            <input 
                              placeholder="Escribe valor y presiona Enter..."
                              className="w-full bg-gray-50/50 border-none rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-indigo-100 font-medium"
                              onKeyPress={(e) => {
                                if(e.key === 'Enter') {
                                  addValueToSpec(sIdx, (e.target as HTMLInputElement).value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Estado del Producto */}
                  <section className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-indigo-900 uppercase tracking-widest leading-none">Visibilidad en Tienda</p>
                      <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase leading-none">Afecta si el cliente puede verlo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="sr-only peer" />
                      <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                      <div className="absolute -top-12 right-0 bg-gray-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Toggle</div>
                    </label>
                  </section>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 border-t border-gray-100 bg-white grid grid-cols-1 sm:flex sm:justify-end gap-3 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="order-2 sm:order-1 bg-gray-50 text-gray-500 font-black px-10 py-5 rounded-[1.5rem] hover:bg-gray-100 transition-all active:scale-95"
              >
                DESCARTAR
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading || uploadingImage}
                className="order-1 sm:order-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black px-12 py-5 rounded-[1.5rem] shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>GUARDANDO...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>GUARDAR CAMBIOS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
