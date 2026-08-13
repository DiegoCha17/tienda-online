"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { STORE_NAME } from "@/lib/constants";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo iniciar sesión");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
        <div className="mb-8"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700"><ShieldCheck /></div><p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">{STORE_NAME} · Admin</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Acceso administrativo</h1><p className="mt-2 text-sm text-slate-500">Gestiona tu tienda desde un espacio privado.</p></div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div><label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-700">Contraseña</label><div className="relative"><LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input id="admin-password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Ingresa tu contraseña" /></div></div>
          {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{loading ? "Verificando..." : "Entrar al panel"}</button>
        </form>
      </div>
    </main>
  );
}
