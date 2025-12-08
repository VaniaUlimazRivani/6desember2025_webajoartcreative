// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diterima." }, { status: 400 });
    }

    // Pastikan folder public/uploads ada
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await (file as File).arrayBuffer());
    // Ganti spasi dengan underscore agar URL aman
    const filename = Date.now() + "_" + (file as File).name.replaceAll(" ", "_");

    // Simpan file ke folder
    await writeFile(path.join(uploadDir, filename), buffer);

    // Kembalikan URL file
    return NextResponse.json({ 
        message: "Berhasil", 
        url: `/uploads/${filename}` 
    }, { status: 201 });

  } catch (error: any) {
    console.log("Error upload:", error);
    return NextResponse.json({ message: "Gagal upload", error: error.message }, { status: 500 });
  }
}