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
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const productId = validateId(params.id);

    if (!productId) {
      return NextResponse.json({ message: "ID produk harus berupa angka." }, { status: 400 });
    }

    // UPDATE: Hanya ambil produk yang BELUM dihapus (deletedAt: null)
    const produk = await prisma.produk.findFirst({
      where: { 
        id: productId,
        deletedAt: null // <--- Filter agar produk sampah dianggap tidak ada
      },
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

// --- DELETE (Pindah ke Sampah / Soft Delete) ---
// Method ini dipanggil saat tombol "Hapus" (Merah) ditekan di halaman Admin
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
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

    // --- PERUBAHAN UTAMA DISINI ---
    // Jangan gunakan .delete(), tapi gunakan .update()
    await prisma.produk.update({
      where: { id: productId },
      data: { deletedAt: new Date() }, // Isi tanggal penghapusan (Soft Delete)
    });

    return NextResponse.json({ message: "Produk berhasil dipindahkan ke sampah." }, { status: 200 });

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
    const params = await props.params;
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