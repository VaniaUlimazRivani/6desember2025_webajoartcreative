import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// cek server
app.get("/", (req, res) => {
  res.json({ message: "Backend berhasil berjalan!" });
});

// contoh ambil semua produk
app.get("/api/produk", async (req, res) => {
  try {
    const produk = await prisma.produk.findMany();
    res.json(produk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// contoh tambah produk
app.post("/api/produk", async (req, res) => {
  try {
    const { nama, harga } = req.body;

    const newProduk = await prisma.produk.create({
      data: { nama, harga: Number(harga) },
    });

    res.json(newProduk);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});