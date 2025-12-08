// src/app/api/konten/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Ambil data
export async function GET() {
  try {
    const data = await prisma.kontenWebsite.findMany();
    
    // Ubah jadi object { key: value }
    const contentMap: Record<string, string> = {};
    data.forEach((item) => {
      contentMap[item.key] = item.value;
    });

    return NextResponse.json(contentMap, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Gagal ambil data", error: error.message }, { status: 500 });
  }
}

// POST: Simpan data (Cara Paling Aman: Delete All -> Create All)
export async function POST(request: Request) {
  try {
    const body = await request.json(); // { hero_judul: "...", kontak_wa: "..." }
    
    // 1. Ubah object body jadi array format Prisma
    // Contoh: [{ key: "hero_judul", value: "..." }, { key: "kontak_wa", value: "..." }]
    const dataToSave = Object.keys(body).map((key) => ({
      key: key,
      value: String(body[key] || "") // Pastikan value selalu string
    }));

    // 2. Gunakan Transaction agar aman
    await prisma.$transaction([
      // Hapus semua data lama (Reset) agar tidak duplikat/error
      prisma.kontenWebsite.deleteMany(),
      
      // Masukkan data baru yang dikirim dari form
      prisma.kontenWebsite.createMany({
        data: dataToSave,
      }),
    ]);

    return NextResponse.json({ message: "Berhasil disimpan" }, { status: 200 });
  } catch (error: any) {
    console.error("Error save konten:", error);
    return NextResponse.json({ message: "Gagal menyimpan", error: error.message }, { status: 500 });
  }
}