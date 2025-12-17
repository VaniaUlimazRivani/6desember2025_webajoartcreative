// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. Cari Admin di Database
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return NextResponse.json({ message: "Username tidak ditemukan" }, { status: 401 });
    }

    // 2. Cek Password (harus hash)
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // 3. Buat Token
    const secret = new TextEncoder().encode("kunci_rahasia_dapur_ajo_art_2025");

    const token = await new SignJWT({
      id: admin.id,
      username: admin.username
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    // 4. Kirim Token via Cookie
    const response = NextResponse.json({ message: "Login Berhasil" }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // wajib FALSE saat localhost
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}
