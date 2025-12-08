// src/app/api/admin/profile/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Ambil data Admin (ID 1)
export async function GET() {
  try {
    // Cari admin pertama
    const admin = await prisma.admin.findFirst();
    
    // Jika belum ada admin sama sekali, kembalikan data kosong default
    if (!admin) {
      return NextResponse.json({ 
        username: 'admin', 
        email: 'admin@ajoart.com' 
      }, { status: 200 });
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}

// PATCH: Update data Admin
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Siapkan data yang mau diupdate
    const dataToUpdate: any = {
      username,
      email,
    };

    // Hanya update password jika diisi (tidak kosong)
    if (password && password.length > 0) {
      dataToUpdate.password = password;
    }

    // Cari admin pertama untuk mendapatkan ID-nya
    const existingAdmin = await prisma.admin.findFirst();

    let updatedAdmin;

    if (existingAdmin) {
      // UPDATE: Jika admin sudah ada
      updatedAdmin = await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: dataToUpdate,
      });
    } else {
      // CREATE: Jika admin belum ada, buat baru (Default ID 1)
      updatedAdmin = await prisma.admin.create({
        data: {
          username: username || 'admin',
          email: email || 'admin@ajoart.com',
          password: password || 'admin123', // Password default jika baru dibuat
        }
      });
    }

    return NextResponse.json({ message: "Profil berhasil diperbarui", admin: updatedAdmin }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: "Gagal update", error: error.message }, { status: 500 });
  }
}