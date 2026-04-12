import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(
    new URL('/admin/login', 'http://localhost:3000')
  );

  response.cookies.set('admin_auth', '', {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: 0,
  });

  return response;
}