import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Ambil semua ulasan untuk Admin
export async function GET() {
  try {
    const data = await prisma.testimoni.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching data", error: error.message }, { status: 500 });
  }
}

// POST: Terima ulasan dari user (Status: Pending)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, text, rating } = body;

    // Validasi data
    if (!name || !text || !rating) {
        return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const newTesti = await prisma.testimoni.create({
      data: {
        name,
        text,
        rating: Number(rating),
        status: "Pending", // Default Pending agar diperiksa admin dulu
      }
    });
    
    return NextResponse.json(newTesti, { status: 201 });
  } catch (error: any) {
    console.error("Error creating testimoni:", error);
    return NextResponse.json({ message: "Gagal menyimpan", error: error.message }, { status: 500 });
  }
}