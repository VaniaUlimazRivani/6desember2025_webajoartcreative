// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// Mencegah instansiasi berkali-kali saat Hot Reloading
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // Tambahkan deklarasi global untuk TypeScript
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Gunakan globalThis.prisma jika sudah ada, jika tidak, buat instance baru
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// Hanya simpan di globalThis saat environment bukan production
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;