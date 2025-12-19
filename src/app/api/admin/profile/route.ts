import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

// PATCH: Update data Admin dengan Hash Password
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Siapkan data yang mau diupdate
    const dataToUpdate: any = {
      username,
      email,
    };

    // PERBAIKAN: Hash password sebelum disimpan
    if (password && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword; // ✅ Disimpan terenkripsi
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
      const defaultHash = await bcrypt.hash(password || 'admin123', 10);
      updatedAdmin = await prisma.admin.create({
        data: {
          username: username || 'admin',
          email: email || 'admin@ajoart.com',
          password: defaultHash,
        }
      });
    }

    return NextResponse.json({ 
      message: "✅ Profil berhasil diperbarui", 
      admin: {
        id: updatedAdmin.id,
        username: updatedAdmin.username,
        email: updatedAdmin.email
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: "Gagal update", error: error.message }, { status: 500 });
  }
}