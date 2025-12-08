// src/app/api/testimoni/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH: Untuk Mengubah Status (Misal: Pending -> Published)
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    const body = await request.json();
    const { status } = body; // "Published" atau "Pending"

    const updated = await prisma.testimoni.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Gagal update", error: error.message }, { status: 500 });
  }
}

// DELETE: Hapus Testimoni
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);

    await prisma.testimoni.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Terhapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Gagal hapus", error: error.message }, { status: 500 });
  }
}