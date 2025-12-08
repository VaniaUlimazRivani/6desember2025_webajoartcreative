import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Mencoba mengambil data...");
  
  // PERBAIKAN: Ganti 'user' menjadi 'admin' (karena model User tidak ada di schema Anda)
  // Jika ingin melihat produk, ganti menjadi: prisma.produk.findMany()
  const data = await prisma.admin.findMany(); 
  
  console.log("Data ditemukan:", data);
}

main()
  .catch((e) => {
    console.error("Terjadi Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Koneksi Prisma diputus.");
  });