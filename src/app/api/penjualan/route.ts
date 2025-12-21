import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// --- GET: AMBIL DATA PENJUALAN ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  // Filter Tanggal (Default: Ambil semua jika tidak ada filter)
  let whereClause: any = {};
  if (start && end) {
    whereClause.tanggal = {
      gte: new Date(new Date(start).setHours(0, 0, 0, 0)),
      lte: new Date(new Date(end).setHours(23, 59, 59, 999)),
    };
  }

  try {
    const sales = await prisma.penjualan.findMany({
      where: whereClause,
      include: {
        produk: { select: { nama: true, kategori: { select: { nama: true } } } }
      },
      orderBy: { tanggal: 'desc' }
    });

    // Format data agar mudah dibaca frontend
    const formattedSales = sales.map(s => ({
      id: s.id,
      tanggal: s.tanggal,
      produkId: s.produkId,
      namaProduk: s.produk?.nama || 'Produk Terhapus',
      kategori: s.produk?.kategori?.nama || '-',
      jumlah: s.jumlah,
      hargaSatuan: s.hargaSatuan,
      total: s.total
    }));

    return NextResponse.json(formattedSales);
  } catch (error) {
    return NextResponse.json({ message: "Gagal ambil data" }, { status: 500 });
  }
}

// --- POST: CATAT PENJUALAN BARU & POTONG STOK ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { produkId, jumlah, tanggal } = body;

    // 1. Cek Stok Dulu
    const produk = await prisma.produk.findUnique({ where: { id: Number(produkId) } });
    if (!produk) return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    if (produk.stok < jumlah) return NextResponse.json({ message: "Stok tidak cukup!" }, { status: 400 });

    // 2. Gunakan Transaksi Database (Agar aman: Simpan Jual + Potong Stok)
    const result = await prisma.$transaction([
      // A. Buat Record Penjualan
      prisma.penjualan.create({
        data: {
          produkId: Number(produkId),
          jumlah: Number(jumlah),
          hargaSatuan: produk.harga,
          total: produk.harga * Number(jumlah),
          tanggal: new Date(tanggal) // Gunakan tanggal inputan user
        }
      }),
      // B. Kurangi Stok Produk
      prisma.produk.update({
        where: { id: Number(produkId) },
        data: { stok: { decrement: Number(jumlah) } }
      })
    ]);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menyimpan penjualan" }, { status: 500 });
  }
}