"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, ImagePlus, Loader2, Plus, Settings2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { formatCRC } from "@/lib/currency";

type Spec = { name: string; values: string[] };

type Product = {
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

type Props = { product: Product; categories: string[] };

const inputClass = "box-border min-h-10 w-full max-w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700";

function parseCRC(value: string) {
  const numericValue = value.replace(/[^0-9]/g, "");
  return numericValue ? Number(numericValue) : NaN;
}

export default function EditProductButton({ product, categories }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(formatCRC(Number(product.price)));
  const [imageUrl, setImageUrl] = useState(product.image_url || "");
  const [stock, setStock] = useState(String(product.stock));
  const [category, setCategory] = useState(product.category || "General");
  const [active, setActive] = useState(product.active);
  const [features, setFeatures] = useState<Record<string, string>>(product.features || {});
  const [images, setImages] = useState<string[]>(product.images?.length ? product.images : product.image_url ? [product.image_url] : []);
  const [specifications, setSpecifications] = useState<Spec[]>(Object.entries(product.specifications || {}).map(([specName, values]) => ({ name: specName, values: values || [] })));
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecValue, setNewSpecValue] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading && !uploadingImage) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [open, loading, uploadingImage]);

  const updateFeature = (key: string, value: string) => setFeatures((current) => ({ ...current, [key]: value }));

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo subir la imagen");
      setImages((current) => [...current, data.url]);
      if (!imageUrl) setImageUrl(data.url);
      toast.success("Imagen añadida");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const nextImages = images.filter((_, imageIndex) => imageIndex !== index);
    setImages(nextImages);
    setImageUrl(nextImages[0] || "");
  };

  const addSpecification = () => {
    const trimmedName = newSpecName.trim();
    if (!trimmedName) {
      toast.warning("Escribe el nombre de la especificación");
      return;
    }
    if (specifications.some((spec) => spec.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.warning("Esa especificación ya existe");
      return;
    }
    setSpecifications((current) => [...current, { name: trimmedName, values: [] }]);
    setNewSpecName("");
  };

  const removeSpecification = (index: number) => setSpecifications((current) => current.filter((_, specIndex) => specIndex !== index));

  const addValueToSpec = (specIndex: number) => {
    const value = (newSpecValue[specIndex] || "").trim();
    if (!value) return;
    setSpecifications((current) => current.map((spec, index) => index === specIndex && !spec.values.includes(value) ? { ...spec, values: [...spec.values, value] } : spec));
    setNewSpecValue((current) => ({ ...current, [specIndex]: "" }));
  };

  const removeValueFromSpec = (specIndex: number, valueIndex: number) => setSpecifications((current) => current.map((spec, index) => index === specIndex ? { ...spec, values: spec.values.filter((_, itemIndex) => itemIndex !== valueIndex) } : spec));

  const handleSave = async () => {
    const trimmedName = name.trim();
    const parsedPrice = parseCRC(price);
    const parsedStock = Number(stock);
    if (trimmedName.length < 3 || trimmedName.length > 160) return toast.warning("El nombre debe tener entre 3 y 160 caracteres");
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) return toast.warning("El precio debe ser mayor que ₡0");
    if (!Number.isSafeInteger(parsedStock) || parsedStock < 0) return toast.warning("El stock debe ser un entero igual o mayor que 0");

    const specsObject: Record<string, string[]> = {};
    specifications.forEach((spec) => {
      if (spec.name.trim() && spec.values.length) specsObject[spec.name.trim()] = spec.values;
    });

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, description: description.trim(), price: parsedPrice, image_url: images[0] || imageUrl, images, stock: parsedStock, category, active, features, specifications: specsObject }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo actualizar el producto");
      toast.success("Producto actualizado correctamente");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-600 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500">Editar</button>
      {open && (
        <div className="fixed inset-0 z-[100] flex h-[100dvh] w-full max-w-full items-center justify-center overflow-hidden bg-slate-950/45 p-0 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-labelledby={`edit-product-${product.id}`}>
          <div className="flex h-full max-h-full w-full min-w-0 max-w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[94dvh] sm:max-w-6xl sm:rounded-2xl">
            <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:items-center sm:px-6">
              <div className="flex min-w-0 max-w-full items-center gap-3"><div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:flex"><Settings2 className="h-5 w-5" /></div><div className="min-w-0 max-w-full"><h2 id={`edit-product-${product.id}`} className="truncate text-base font-black text-slate-950 sm:text-lg">Editar producto <span className="font-medium text-slate-400">#{product.id}</span></h2><p className="hidden max-w-full text-xs text-slate-500 sm:block sm:whitespace-normal sm:break-words">Actualiza información, inventario y opciones disponibles.</p></div></div>
              <button type="button" onClick={() => !loading && setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Cerrar edición"><X className="h-5 w-5" /></button>
            </header>

            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6">
              <div className="grid min-w-0 max-w-full gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
                <section className="min-w-0 space-y-5" aria-labelledby={`general-${product.id}`}>
                  <div><h3 id={`general-${product.id}`} className="text-sm font-bold text-slate-950">Información general</h3><p className="mt-1 text-xs text-slate-500">Los datos principales que verá el cliente.</p></div>
                  <div><label htmlFor={`name-${product.id}`} className={labelClass}>Nombre del producto</label><input id={`name-${product.id}`} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} /></div>
                  <div><label htmlFor={`description-${product.id}`} className={labelClass}>Descripción</label><textarea id={`description-${product.id}`} value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className={`${inputClass} resize-y py-2.5`} /></div>
                  <div className="grid min-w-0 gap-4 md:grid-cols-2"><div className="min-w-0"><label htmlFor={`price-${product.id}`} className={labelClass}>Precio (colones)</label><input id={`price-${product.id}`} type="text" inputMode="numeric" value={price} onFocus={() => setPrice(String(parseCRC(price) || ""))} onChange={(event) => setPrice(event.target.value.replace(/[^0-9₡.,\s]/g, ""))} onBlur={() => { const value = parseCRC(price); setPrice(Number.isFinite(value) ? formatCRC(value) : ""); }} className={inputClass} aria-describedby={`price-help-${product.id}`} /><p id={`price-help-${product.id}`} className="mt-1 max-w-full text-[11px] text-slate-400 break-words">Formato mostrado: ₡784 555</p></div><div className="min-w-0"><label htmlFor={`stock-${product.id}`} className={labelClass}>Stock</label><input id={`stock-${product.id}`} type="number" min="0" step="1" value={stock} onChange={(event) => setStock(event.target.value)} className={inputClass} /></div></div>
                  <div className="grid min-w-0 gap-4 md:grid-cols-2"><div className="min-w-0"><label htmlFor={`category-${product.id}`} className={labelClass}>Categoría</label><select id={`category-${product.id}`} value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass}>{!categories.includes(category) && <option value={category}>{category}</option>}{categories.map((categoryName) => <option key={categoryName} value={categoryName}>{categoryName}</option>)}</select></div><div className="min-w-0"><label htmlFor={`active-${product.id}`} className={labelClass}>Estado</label><select id={`active-${product.id}`} value={active ? "active" : "inactive"} onChange={(event) => setActive(event.target.value === "active")} className={inputClass}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></div></div>

                  <div className="min-w-0 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4"><div className="flex min-w-0 items-center justify-between gap-4"><div className="min-w-0"><h3 className="text-sm font-bold text-slate-900">Visibilidad</h3><p className="mt-1 max-w-full text-xs leading-5 text-slate-500 break-words">Los clientes pueden encontrar y comprar este producto.</p></div><button type="button" onClick={() => setActive(!active)} className={`relative h-8 w-12 shrink-0 rounded-full transition ${active ? "bg-indigo-600" : "bg-slate-300"}`} aria-label={active ? "Ocultar producto" : "Mostrar producto"} aria-pressed={active}><span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${active ? "left-5" : "left-1"}`} /></button></div></div>
                </section>

                <section className="min-w-0" aria-labelledby={`gallery-${product.id}`}>
                  <div className="mb-3"><h3 id={`gallery-${product.id}`} className="text-sm font-bold text-slate-950">Galería</h3><p className="mt-1 text-xs text-slate-500">La primera imagen se usa como portada.</p></div>
                  <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2">
                    {images.map((image, index) => <div key={`${image}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"><Image src={image} alt={`Imagen ${index + 1} de ${product.name}`} fill sizes="(max-width: 640px) 50vw, 220px" className="object-contain p-2" />{index === 0 && <span className="absolute left-2 top-2 rounded-md bg-slate-950/85 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">Principal</span>}<button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-rose-600 opacity-100 shadow-sm transition hover:bg-rose-600 hover:text-white" aria-label={`Eliminar imagen ${index + 1}`}><Trash2 className="h-4 w-4" /></button></div>)}
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"><input type="file" accept="image/*" onChange={handleImageChange} disabled={uploadingImage} className="sr-only" />{uploadingImage ? <Loader2 className="h-6 w-6 animate-spin" /> : <><ImagePlus className="h-6 w-6" /><span className="mt-2 text-xs font-bold">Añadir imagen</span></>}</label>
                  </div>
                </section>
              </div>

              <section className="mt-7 min-w-0 max-w-full border-t border-slate-200 pt-6" aria-labelledby={`specs-${product.id}`}>
                <div className="flex min-w-0 flex-col justify-between gap-3 md:flex-row md:items-end"><div className="min-w-0"><h3 id={`specs-${product.id}`} className="text-sm font-bold text-slate-950">Especificaciones</h3><p className="mt-1 max-w-full text-xs text-slate-500 break-words">Añade opciones como talla o color. Cada valor aparece como una opción para el cliente.</p></div><div className="flex min-w-0 w-full gap-2 md:w-auto"><input value={newSpecName} onChange={(event) => setNewSpecName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addSpecification()} placeholder="Ej. Talla" className={`${inputClass} min-w-0 md:w-48`} aria-label="Nombre de especificación" /><button type="button" onClick={addSpecification} className="flex h-10 shrink-0 items-center gap-1 rounded-lg bg-slate-950 px-3 text-xs font-bold text-white hover:bg-indigo-700"><Plus className="h-4 w-4" /> <span className="hidden sm:inline">Añadir</span><span className="sm:hidden">+</span></button></div></div>
                <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">{specifications.map((spec, specIndex) => <div key={`${spec.name}-${specIndex}`} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 p-3"><div className="flex min-w-0 items-center justify-between gap-2"><span className="min-w-0 break-words text-sm font-bold text-slate-900">{spec.name}</span><button type="button" onClick={() => removeSpecification(specIndex)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Eliminar especificación ${spec.name}`}><Trash2 className="h-4 w-4" /></button></div><div className="mt-2 flex min-w-0 flex-wrap gap-1.5">{spec.values.map((value, valueIndex) => <span key={`${value}-${valueIndex}`} className="inline-flex max-w-full min-w-0 items-center gap-1 break-words rounded-md border border-indigo-100 bg-white px-2 py-1 text-xs font-semibold text-indigo-700">{value}<button type="button" onClick={() => removeValueFromSpec(specIndex, valueIndex)} className="shrink-0 text-indigo-300 hover:text-rose-600" aria-label={`Eliminar valor ${value}`}><X className="h-3 w-3" /></button></span>)}</div><div className="mt-3 flex min-w-0 gap-2"><input value={newSpecValue[specIndex] || ""} onChange={(event) => setNewSpecValue((current) => ({ ...current, [specIndex]: event.target.value }))} onKeyDown={(event) => event.key === "Enter" && addValueToSpec(specIndex)} placeholder="Añadir valor" className={`${inputClass} min-h-9 text-xs`} /><button type="button" onClick={() => addValueToSpec(specIndex)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600" aria-label={`Añadir valor a ${spec.name}`}><Plus className="h-4 w-4" /></button></div></div>)}</div>
              </section>

              <section className="mt-7 min-w-0 max-w-full border-t border-slate-200 pt-6" aria-labelledby={`features-${product.id}`}><div className="mb-3"><h3 id={`features-${product.id}`} className="text-sm font-bold text-slate-950">Características del producto</h3><p className="mt-1 max-w-full text-xs text-slate-500 break-words">Información técnica que aparece en la ficha pública.</p></div><div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">{[["height", "Alto"], ["width", "Ancho"], ["length", "Largo"], ["weight", "Peso"], ["texture", "Textura"], ["ingredients", "Ingredientes / composición"]].map(([key, label]) => <div key={key} className="min-w-0"><label htmlFor={`feature-${key}-${product.id}`} className={labelClass}>{label}</label><input id={`feature-${key}-${product.id}`} value={features[key] || ""} onChange={(event) => updateFeature(key, event.target.value)} className={inputClass} /></div>)}</div></section>
            </div>

            <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-6"><p className="hidden text-xs text-slate-400 sm:block">Producto #{product.id} · Cambios guardados al confirmar</p><div className="flex w-full min-w-0 gap-2 sm:w-auto"><button type="button" onClick={() => !loading && setOpen(false)} className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:flex-none sm:px-4">Cancelar</button><button type="button" onClick={handleSave} disabled={loading || uploadingImage} className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60 sm:flex-none sm:px-5">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : <><Check className="h-4 w-4" /> Guardar cambios</>}</button></div></footer>
          </div>
        </div>
      )}
    </>
  );
}
