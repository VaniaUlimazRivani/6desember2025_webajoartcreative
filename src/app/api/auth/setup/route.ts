// src/app/api/auth/setup/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// API ini hanya dijalankan SEKALI untuk membuat/reset admin pertama
export async function GET() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10); // Password default: admin123

    // Cek apakah admin sudah ada
    const existingAdmin = await prisma.admin.findFirst();

    if (existingAdmin) {
      // Jika ada, update passwordnya jadi terenkripsi
      await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: { password: passwordHash }
      });
      return NextResponse.json({ message: "Admin diperbarui. Login: admin / admin123" });
    } else {
      // Jika belum ada, buat baru
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: passwordHash,
          email: 'admin@ajoart.com'
        }
      });
      return NextResponse.json({ message: "Admin dibuat. Login: admin / admin123" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}