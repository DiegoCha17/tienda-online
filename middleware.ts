import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware para proteger las rutas de administración
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Proteger rutas /admin y /api/admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    
    // Si estamos en la página de login, permitimos el acceso
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
      return NextResponse.next()
    }
    
    // Verificamos la cookie de sesión
    const hasSession = request.cookies.has('admin_auth')
    
    // Si no hay sesión y es ruta de API, devolvemos 401
    if (!hasSession && pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    // Si no hay sesión y es página, redirigimos al login
    if (!hasSession) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
