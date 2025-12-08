// src/app/api/laporan/ringkasan/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Ambil semua produk
    const products = await prisma.produk.findMany({
      include: { kategori: true },
    });

    // 1. Hitung Total Aset (Harga x Stok setiap barang)
    const totalAset = products.reduce((acc, item) => {
      return acc + (item.harga * item.stok);
    }, 0);

    // 2. Hitung Total Stok Fisik
    const totalStok = products.reduce((acc, item) => acc + item.stok, 0);

    // 3. Cari Produk Stok Menipis (Kurang dari 5)
    const stokMenipis = products.filter(item => item.stok < 5);

    // 4. Grouping Aset per Kategori
    const asetPerKategori: Record<string, number> = {};
    products.forEach((item) => {
      const namaKat = item.kategori?.nama || 'Lainnya';
      if (!asetPerKategori[namaKat]) {
        asetPerKategori[namaKat] = 0;
      }
      asetPerKategori[namaKat] += (item.harga * item.stok);
    });

    return NextResponse.json({
      totalProduk: products.length,
      totalAset,
      totalStok,
      stokMenipis, // Mengirim daftar barang yang mau habis
      asetPerKategori,
      allProducts: products // Mengirim detail untuk tabel
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}