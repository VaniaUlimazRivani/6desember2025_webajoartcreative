// src/app/api/produk/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// --- HANDLER GET (Ambil Semua Produk) ---
export async function GET() {
  try {
    const produk = await prisma.produk.findMany({
      include: {
        kategori: true, // Sertakan data kategori (relasi)
      },
      orderBy: {
        id: 'desc', // Urutkan dari yang terbaru (opsional)
      },
    });
    return NextResponse.json(produk, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching produk:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data produk.", error: error.message },
      { status: 500 }
    );
  }
}

// --- HANDLER POST (Tambah Produk Baru) ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, harga, stok, deskripsi, gambar, kategoriId } = body; 

    // 1. Validasi Input Wajib
    // Pastikan field penting tidak kosong
    if (!nama || !harga || stok === undefined || !kategoriId) {
      return NextResponse.json(
        { message: "Nama, harga, stok, dan kategoriId wajib diisi." },
        { status: 400 }
      );
    }
    
    // 2. Simpan ke Database
    const newProduk = await prisma.produk.create({
      data: { 
        nama, 
        harga: Number(harga),      // Konversi ke angka
        stok: Number(stok),        // Konversi ke angka
        kategoriId: Number(kategoriId), // Konversi ke angka
        deskripsi: deskripsi || null, 
        gambar: gambar || null,    // Ini menerima string URL (contoh: "/uploads/foto.jpg")
      },
    });

    return NextResponse.json(newProduk, { status: 201 }); 
  } catch (error: any) {
    console.error("Error adding produk:", error);
    
    // Penanganan Error Spesifik Prisma
    let errorMessage = "Gagal menambahkan produk.";
    
    if (error.code === 'P2003') { 
        errorMessage = "ID Kategori tidak ditemukan di database.";
    }
    else if (error.code === 'P2002') { 
        errorMessage = "Nama produk sudah ada (duplikat).";
    }

    return NextResponse.json(
      { message: errorMessage, error: error.message },
      { status: 500 }
    );
  }
}