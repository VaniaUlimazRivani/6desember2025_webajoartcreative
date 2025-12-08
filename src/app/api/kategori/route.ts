import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const kategori = await prisma.kategori.findMany();
    return NextResponse.json(kategori, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Gagal", error: error.message }, { status: 500 });
  }
}

// Pastikan fungsi ini bernama POST (Huruf Besar)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.nama) return NextResponse.json({ message: "Nama wajib" }, { status: 400 });

    const newKategori = await prisma.kategori.create({
      data: { nama: body.nama },
    });

    return NextResponse.json(newKategori, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Gagal", error: error.message }, { status: 500 });
  }
}