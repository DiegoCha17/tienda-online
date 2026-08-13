"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Menu, Package, ShoppingBag, Store, X } from "lucide-react";
import { STORE_NAME } from "@/lib/constants";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos e inventario", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
];

export default function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur lg:pl-64">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Abrir menú administrativo">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden text-sm font-semibold text-slate-500 lg:block">Panel de administración</div>
          <div className="ml-auto flex items-center gap-3 text-sm font-semibold text-slate-700"><span className="hidden sm:inline">Administrador</span><span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">A</span></div>
        </div>
      </header>

      <aside className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-all lg:flex ${collapsed ? "w-20" : "w-64"}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          {!collapsed && <div><Link href="/" className="font-black text-white">{STORE_NAME}</Link><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300">Admin</p></div>}
          <button type="button" onClick={() => setCollapsed(!collapsed)} className="rounded-lg p-2 hover:bg-white/10" aria-label={collapsed ? "Expandir menú" : "Contraer menú"}>{collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}</button>
        </div>
        <nav className="flex-1 space-y-2 p-3" aria-label="Navegación administrativa">
          {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} title={collapsed ? label : undefined} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-white/10 hover:text-white"><Icon className="h-5 w-5 shrink-0" />{!collapsed && label}</Link>)}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-3">
          <Link href="/" title={collapsed ? "Ver tienda" : undefined} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-white/10 hover:text-white"><Store className="h-5 w-5 shrink-0" />{!collapsed && "Ver tienda"}</Link>
          <form action="/api/admin/logout" method="POST"><button type="submit" className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-300 hover:bg-rose-500/10">{collapsed ? "Salir" : "Cerrar sesión"}</button></form>
        </div>
      </aside>

      <div className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOpen(false)} />
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-slate-300 transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5"><div><Link href="/" className="font-black text-white">{STORE_NAME}</Link><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300">Admin</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X /></button></div>
        <nav className="space-y-2 p-3">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold hover:bg-white/10 hover:text-white"><Icon className="h-5 w-5" />{label}</Link>)}</nav>
        <div className="mt-auto space-y-2 border-t border-white/10 p-3"><Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold hover:bg-white/10 hover:text-white"><Store className="h-5 w-5" />Ver tienda</Link><form action="/api/admin/logout" method="POST"><button type="submit" className="w-full rounded-xl px-3 py-3 text-left font-semibold text-rose-300 hover:bg-rose-500/10">Cerrar sesión</button></form></div>
      </aside>

      <main className={`min-h-screen pt-24 transition-all ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}><div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">{children}</div></main>
    </div>
  );
}
