import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logout Berhasil' });

  // Hapus cookie token — gunakan maxAge:0 dan atribut yang sama saat cookie dibuat
  res.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',   // atau 'none' jika awalnya diset sameSite: 'none'
    secure: false,     // set true jika di production dengan HTTPS dan cookie awal diset secure
  });

  return res;
}