"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCRC } from "@/lib/currency";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/lib/hooks/useCart";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface CartClientProps {
  whatsappNumber?: string;
}

const formSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio (al menos 2 caracteres)"),
  email: z.string().email("Debe ser un correo electrónico válido"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CartClient({ whatsappNumber }: CartClientProps) {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCart(cartItemId);
    toast.success("Producto eliminado del carrito");
    if (cart.length <= 1) {
      setShowForm(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowForm(false);
    toast.info("Carrito vaciado");
  };

  const submitOrder = async (values: FormValues) => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: values, cart, total }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al procesar el pedido");
      }
      
      let message = `*NUEVO PEDIDO*\n\n`;
      message += `*Datos del Cliente:*\n`;
      message += `- Nombre: ${values.name}\n`;
      message += `- Correo: ${values.email}\n`;
      if (values.address) message += `- Dirección: ${values.address}\n\n`;
      
      message += `*Productos:*\n`;
      cart.forEach((item) => {
        message += `${item.quantity}x ${item.name} - ${formatCRC(item.price * item.quantity)}\n`;
        if (item.selectedSpecs) {
          Object.entries(item.selectedSpecs).forEach(([k, v]) => {
            message += ` - ${k}: ${v}\n`;
          });
        }
      });
      message += `\n*TOTAL:* ${formatCRC(total)}`;
      
      const encodedMessage = encodeURIComponent(message);
      const phoneNum = whatsappNumber || WHATSAPP_NUMBER;
      const waUrl = `https://wa.me/${phoneNum}?text=${encodedMessage}`;
      
      window.open(waUrl, "_blank");
      toast.success(
        "¡Pedido procesado de forma segura! Redirigiendo a WhatsApp...",
        { duration: 5000 },
      );
      
      clearCart();
      setShowForm(false);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo enviar el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 transition-colors animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">
          Tu Carrito de Compras
        </h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-sm p-16 text-center space-y-6 border border-gray-100 animate-slide-up">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800">
              No hay productos en tu carrito
            </h2>
            <p className="text-lg text-gray-500">
              ¿Qué te parece si exploramos algunos productos increíbles?
            </p>
            <Link
              href="/#catalogo"
              className="inline-block mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/30"
            >
              Ir a comprar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.cartItemId || item.id}
                  className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col sm:flex-row gap-6 items-center border border-gray-100 transform hover:-translate-y-1 animate-slide-up"
                >
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <Image
                      src={item.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {item.name}
                    </h2>
                    {item.selectedSpecs &&
                      Object.keys(item.selectedSpecs).length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-2">
                          {Object.entries(item.selectedSpecs).map(
                            ([k, v], idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium border border-gray-200"
                              >
                                {k}: {v}
                              </span>
                            ),
                          )}
                        </div>
                      )}
                    <p className="text-indigo-600 font-semibold text-lg">
                      {formatCRC(item.price)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Subtotal:{" "}
                      <span className="font-medium text-gray-900">
                        {formatCRC(item.price * item.quantity)}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center sm:items-end gap-5 min-w-[140px]">
                    <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.cartItemId || item.id.toString(),
                            item.quantity - 1,
                          )
                        }
                        aria-label={`Reducir cantidad de ${item.name}`}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600 font-medium text-lg"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.cartItemId || item.id.toString(),
                            item.quantity + 1,
                          )
                        }
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600 font-medium text-lg"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem(item.cartItemId || item.id.toString())
                      }
                      aria-label={`Eliminar ${item.name} del carrito`}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-500/5 p-8 border border-gray-100 sticky top-24 animate-slide-up">
                <h3 className="text-2xl font-black text-gray-900 mb-6">
                  Resumen
                </h3>
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                  <span className="text-gray-500 text-lg">Subtotal</span>
                  <span className="font-semibold text-lg text-gray-900">
                    {formatCRC(total)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-3xl font-black text-indigo-600">
                    {formatCRC(total)}
                  </span>
                </div>
                
                {!showForm ? (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="w-full bg-gray-900 hover:bg-black text-white font-semibold px-6 py-4 rounded-xl transition-all shadow-lg shadow-gray-900/20 transform hover:-translate-y-1 text-lg"
                    >
                      Completar Datos
                    </button>
                    <Link
                      href="/#catalogo"
                      className="w-full flex justify-center text-gray-600 hover:text-gray-900 font-medium py-3"
                    >
                      Seguir comprando
                    </Link>
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="w-full flex justify-center text-red-500 hover:text-red-700 text-sm font-bold pt-4 pb-2 border-t border-gray-100"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(submitOrder)}
                    className="space-y-6 animate-fade-in"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Nombre Completo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("name")}
                          className="w-full text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none border"
                          placeholder="Tu nombre y apellido"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          className="w-full text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none border"
                          placeholder="tucorreo@ejemplo.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          {...register("phone")}
                          className="w-full text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none border"
                          placeholder="Ej: 8888-8888"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Dirección de Entrega
                        </label>
                        <textarea
                          {...register("address")}
                          rows={3}
                          className="w-full text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none border resize-none"
                          placeholder="Provincia, Cantón, Distrito, y señas exactas..."
                        />
                        {errors.address && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="pt-4 space-y-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#25D366] hover:bg-[#1ebd5b] disabled:opacity-75 disabled:cursor-wait text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1 text-lg"
                      >
                        {loading ? (
                          <>
                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Confirmar y enviar a WhatsApp
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="w-full bg-white text-gray-700 font-semibold px-4 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        Volver al carrito
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
