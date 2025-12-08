// src/app/api/produk/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// --- VALIDASI ID HELPER ---
function validateId(id: string) {
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return null;
  }
  return productId;
}

// --- GET (Ambil 1 Produk) ---
export async function GET(
  request: Request,
  // Perubahan Next.js 15: params harus bertipe Promise
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Perubahan Next.js 15: Wajib await params
    const params = await props.params;
    
    const productId = validateId(params.id);
    if (!productId) {
      return NextResponse.json({ message: "ID produk harus berupa angka." }, { status: 400 });
    }

    const produk = await prisma.produk.findUnique({
      where: { id: productId },
      include: { kategori: true },
    });

    if (!produk) {
      return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(produk, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error server", error: error.message }, { status: 500 });
  }
}

// --- DELETE (Hapus Produk) ---
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params; // <--- INI KUNCINYA
    const productId = validateId(params.id);
    
    if (!productId) {
      return NextResponse.json({ message: "ID produk harus berupa angka." }, { status: 400 });
    }

    const produkExist = await prisma.produk.findUnique({
      where: { id: productId },
    });

    if (!produkExist) {
      return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
    }

    await prisma.produk.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus." }, { status: 200 });

  } catch (error: any) {
    console.error("Error deleting produk:", error);
    return NextResponse.json(
      { message: "Gagal menghapus produk.", error: error.message },
      { status: 500 }
    );
  }
}

// --- PATCH (Edit Produk) ---
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params; // <--- INI KUNCINYA
    const productId = validateId(params.id);
    
    if (!productId) {
      return NextResponse.json({ message: "ID produk harus berupa angka." }, { status: 400 });
    }

    const body = await request.json();
    const { nama, harga, stok, deskripsi, gambar, kategoriId } = body;

    const produkExist = await prisma.produk.findUnique({
      where: { id: productId },
    });

    if (!produkExist) {
      return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
    }

    const updatedProduk = await prisma.produk.update({
      where: { id: productId },
      data: {
        nama: nama || undefined,
        harga: harga ? Number(harga) : undefined,
        stok: stok !== undefined ? Number(stok) : undefined,
        kategoriId: kategoriId ? Number(kategoriId) : undefined,
        deskripsi: deskripsi || undefined,
        gambar: gambar || undefined,
      },
    });

    return NextResponse.json(updatedProduk, { status: 200 });

  } catch (error: any) {
    console.error("Error updating produk:", error);
    let errorMessage = "Gagal mengupdate produk.";
    if (error.code === 'P2003') errorMessage = "Kategori ID tidak valid.";

    return NextResponse.json(
      { message: errorMessage, error: error.message },
      { status: 500 }
    );
  }
}