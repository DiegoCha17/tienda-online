'use client';

import { useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
};

type Props = {
  product: Product;
};

export default function AddToCartButton({ product }: Props) {
  const [isAdded, setIsAdded] = useState(false);

  const addToCart = () => {
    const raw = localStorage.getItem('cart');
    const cart = raw ? JSON.parse(raw) : [];

    const existing = cart.find((item: any) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        cartItemId: Date.now().toString() + Math.random().toString(36).substring(2),
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={addToCart}
      className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${isAdded
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 hover:-translate-y-1'
        }`}
    >
      {isAdded ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Agregado
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Agregar al carrito
        </>
      )}
    </button>
  );
}