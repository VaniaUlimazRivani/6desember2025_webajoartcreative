// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log(`[Middleware Check] Path: ${pathname}`);
  console.log(`[Middleware Check] Token ditemukan? ${token ? "YA" : "TIDAK"}`);
  if (token) console.log(`[Middleware Check] Isi Token: ${token.substring(0, 10)}...`);

  const secret = new TextEncoder().encode("kunci_rahasia_dapur_ajo_art_2025");

  // Proteksi halaman admin
  if (pathname.startsWith('/admin') && pathname !== '/login') {
    if (!token) {
      console.log("--> Ditolak: Tidak ada token. Redirect ke Login (/login).");
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(token, secret);
      console.log("--> Diterima: Token Valid.");
      return NextResponse.next();
    } catch (error) {
      console.log("--> Ditolak: Token Invalid/Expired.");
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Jika user sudah login, cegah buka /login
  if (pathname === '/login' && token) {
    try {
      await jwtVerify(token, secret);
      console.log("--> User sudah login, redirect ke dashboard.");
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } catch (error) {
      // token invalid → biar bisa login ulang
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
