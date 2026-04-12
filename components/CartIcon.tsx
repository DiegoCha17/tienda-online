'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartIcon() {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    try {
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];
      const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCount(totalItems);
    } catch (e) {
      setCount(0);
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('cart-updated', updateCount);
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  return (
    <Link
      href="/carrito"
      className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <svg
        className="w-6 h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full animate-pulse-slow">
          {count}
        </span>
      )}
    </Link>
  );
}
