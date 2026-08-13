import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidAdminToken } from "@/lib/admin-auth";

// Protege las rutas de administración antes de renderizar o ejecutar la API.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (pathname === "/admin/login" || pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    const hasSession = isValidAdminToken(request.cookies.get("admin_auth")?.value);
    if (!hasSession && pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!hasSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
