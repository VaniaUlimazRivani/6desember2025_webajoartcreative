// src/app/api/kategori/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    // 1. Cek apakah kategori ini sedang dipakai oleh Produk?
    // Jika masih ada produk yang pakai kategori ini, jangan dihapus (biar database aman)
    const categoryInUse = await prisma.produk.findFirst({
      where: { kategoriId: id }
    });

    if (categoryInUse) {
      return NextResponse.json(
        { message: "Gagal hapus: Kategori ini masih digunakan oleh produk." }, 
        { status: 400 }
      );
    }

    // 2. Proses Hapus
    await prisma.kategori.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kategori berhasil dihapus" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: "Error server", error: error.message }, { status: 500 });
  }
}