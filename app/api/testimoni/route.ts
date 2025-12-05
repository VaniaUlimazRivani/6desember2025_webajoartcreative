import { NextResponse } from "next/server";

// DATA DUMMY TESTIMONI (Simulasi Database)
// Di aplikasi nyata, ini diganti dengan Prisma + Database
let testimonials = [
  { id: 1, name: 'Budi Santoso', text: 'Barang sangat bagus, unik dan artistik.', rating: 5, status: 'Published', date: '2025-02-20' },
  { id: 2, name: 'Siti Aminah', text: 'Pengiriman agak lama tapi barang oke.', rating: 4, status: 'Pending', date: '2025-02-21' },
  { id: 3, name: 'Rahmat Hidayat', text: 'Kurang suka dengan finishingnya.', rating: 3, status: 'Hidden', date: '2025-02-22' },
];

// GET: Ambil semua testimoni (Untuk Admin) atau hanya yang Published (Untuk Publik)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'public' atau 'admin'

  if (type === 'public') {
    // Pengunjung hanya melihat yang Published
    const published = testimonials.filter(t => t.status === 'Published');
    return NextResponse.json(published);
  }

  // Admin melihat semua
  return NextResponse.json(testimonials);
}

// POST: Tambah testimoni baru (Dari Pengunjung)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newTestimonial = {
      id: Date.now(), // ID unik sederhana
      name: body.name,
      text: body.text,
      rating: parseInt(body.rating),
      status: 'Pending', // Default status: Pending (perlu persetujuan admin)
      date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
    };

    testimonials.push(newTestimonial as any); // Simpan ke array dummy

    return NextResponse.json({ message: "Testimoni berhasil dikirim!", data: newTestimonial }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan testimoni" }, { status: 500 });
  }
}

// PUT: Update status testimoni (Approve/Hide oleh Admin)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    testimonials = testimonials.map(t => 
      t.id === id ? { ...t, status: status } : t
    );

    return NextResponse.json({ message: "Status berhasil diperbarui" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}

// DELETE: Hapus testimoni
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    testimonials = testimonials.filter(t => t.id !== id);

    return NextResponse.json({ message: "Testimoni berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus" }, { status: 500 });
  }
}