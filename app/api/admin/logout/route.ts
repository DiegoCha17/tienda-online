import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const response = NextResponse.redirect(
    new URL('/admin/login', req.url)
  );

  response.cookies.set('admin_auth', '', {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: 0,
  });

  return response;
}