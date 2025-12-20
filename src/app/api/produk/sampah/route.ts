import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Sesuaikan path prisma Anda

// 1. AMBIL DATA SAMPAH
export async function GET() {
  const sampah = await prisma.produk.findMany({
    where: {
      NOT: { deletedAt: null } // Ambil yang deletedAt-nya ADA isinya
    },
    include: { kategori: true },
    orderBy: { deletedAt: 'desc' }
  });
  return NextResponse.json(sampah);
}

// 2. RESTORE / PULIHKAN DATA
export async function POST(req: Request) {
  const { id } = await req.json();
  
  await prisma.produk.update({
    where: { id: Number(id) },
    data: { deletedAt: null } // Kosongkan lagi tanggalnya agar aktif kembali
  });
  
  return NextResponse.json({ message: "Data dipulihkan" });
}

// 3. HAPUS PERMANEN
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  await prisma.produk.delete({
    where: { id: Number(id) }, // Ini baru hapus permanen dari DB
  });

  return NextResponse.json({ message: "Dihapus permanen" });
}