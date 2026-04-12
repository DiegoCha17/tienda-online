'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCRC } from '@/lib/currency';

type CartItem = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

interface CartClientProps {
  whatsappNumber?: string;
}

export default function CartClient({ whatsappNumber }: CartClientProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      const parsed = raw ? JSON.parse(raw) : [];
      setCart(parsed);
    } catch (error) {
      console.error('Error leyendo carrito:', error);
      setCart([]);
    }
  }, []);

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;

    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    saveCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);

    if (updated.length === 0) {
      setShowForm(false);
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
    setShowForm(false);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [loading, setLoading] = useState(false);

  const submitOrder = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Por favor completa tu nombre y correo como mínimo.');
      return;
    }

    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage('');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, email, phone, address },
          cart,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      let message = `*NUEVO PEDIDO*\n\n`;
      message += `*Orden Oficial:* ${data.orderId}\n\n`;
      message += `*Datos del Cliente:*\n`;
      message += `- Nombre: ${name}\n`;
      message += `- Correo: ${email}\n`;
      if (address) message += `- Dirección: ${address}\n\n`;

      message += `*Productos:*\n`;
      cart.forEach(item => {
        message += `${item.quantity}x ${item.name} (${formatCRC(item.price * item.quantity)})\n`;
      });

      message += `\n*TOTAL:* ${formatCRC(total)}`;

      const encodedMessage = encodeURIComponent(message);
      const phoneNum = whatsappNumber || '70939586';
      const waUrl = `https://wa.me/${phoneNum}?text=${encodedMessage}`;

      window.open(waUrl, '_blank');

      setSuccessMessage('¡Pedido procesado de forma segura! Redirigiendo a WhatsApp...');
      localStorage.removeItem('cart');
      setCart([]);
      setShowForm(false);
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error: any) {
      alert(error.message || 'No se pudo enviar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Tu Carrito de Compras</h1>

        {successMessage && (
          <div className="mb-8 rounded-2xl bg-green-50 border border-green-200 text-green-800 p-6 shadow-sm flex items-center gap-4">
            <span className="text-3xl">🎉</span>
            <p className="font-medium text-lg">{successMessage}</p>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center space-y-6 border border-gray-100">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800">No hay productos en tu carrito</h2>
            <p className="text-lg text-gray-500">¿Qué te parece si exploramos algunos productos increíbles?</p>
            <Link
              href="/"
              className="inline-block mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Ir a comprar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col sm:flex-row gap-6 items-center border border-gray-100"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-32 h-32 rounded-xl object-cover shadow-sm bg-gray-100"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h2>
                    <p className="text-blue-600 font-semibold text-lg">{formatCRC(item.price)}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Subtotal: <span className="font-medium text-gray-900">{formatCRC(item.price * item.quantity)}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-center sm:items-end gap-5 min-w-[140px]">
                    <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600 font-medium text-lg"
                      >-</button>
                      <span className="w-12 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600 font-medium text-lg"
                      >+</button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h3>
                
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                  <span className="text-gray-500 text-lg">Subtotal</span>
                  <span className="font-semibold text-lg text-gray-900">{formatCRC(total)}</span>
                </div>
                
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-blue-600">{formatCRC(total)}</span>
                </div>

                {!showForm ? (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white font-semibold px-6 py-4 rounded-xl transition-all shadow-lg shadow-gray-900/20 transform hover:-translate-y-1 text-lg"
                    >
                      Completar Datos
                    </button>
                    <Link
                      href="/"
                      className="w-full flex justify-center text-gray-600 hover:text-gray-900 font-medium py-3"
                    >
                      Seguir comprando
                    </Link>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="w-full flex justify-center text-red-500 hover:text-red-700 text-sm font-bold pt-4 pb-2 border-t border-gray-100"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none border"
                          placeholder="Tu nombre y apellido"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none border"
                          placeholder="tucorreo@ejemplo.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none border"
                          placeholder="Ej: 8888-8888"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Dirección de Entrega</label>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={3}
                          className="w-full border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none border resize-none"
                          placeholder="Provincia, Cantón, Distrito, y señas exactas..."
                        />
                      </div>
                    </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="button"
                    onClick={submitOrder}
                    disabled={loading}
                    className="w-full bg-[#25D366] hover:bg-[#1ebd5b] disabled:opacity-75 disabled:cursor-wait text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1 text-lg"
                  >
                    {loading ? (
                      <>
                        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}