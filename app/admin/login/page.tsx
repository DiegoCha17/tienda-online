'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Contraseña incorrecta');
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Acceso administrador</h1>

      <div className="border rounded-lg p-4 space-y-4">
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          type="button"
          onClick={handleLogin}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Entrar
        </button>
      </div>
    </main>
  );
}