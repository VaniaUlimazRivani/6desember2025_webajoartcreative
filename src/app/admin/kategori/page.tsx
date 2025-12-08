'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Tag, Loader2 } from 'lucide-react';

interface Kategori {
  id: number;
  nama: string;
  _count?: {
    produk: number; // Untuk menampilkan jumlah produk di kategori ini (opsional)
  };
}

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. FETCH DATA ---
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/kategori');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Gagal ambil data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- 2. TAMBAH KATEGORI ---
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/kategori', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: newCategory }),
      });

      if (res.ok) {
        alert('Kategori berhasil ditambahkan!');
        setNewCategory(''); // Reset input
        fetchCategories(); // Refresh tabel
      } else {
        const err = await res.json();
        alert(`Gagal: ${err.message}`); // Misalnya nama kembar
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. HAPUS KATEGORI ---
  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Yakin hapus kategori "${nama}"?`)) return;

    try {
      const res = await fetch(`/api/kategori/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        alert('Kategori dihapus.');
        fetchCategories();
      } else {
        alert(`Gagal: ${data.message}`);
      }
    } catch (error) {
      alert('Gagal menghapus kategori.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="p-2 rounded-full bg-white border border-[#E6D5B8] text-gray-500 hover:text-[#C87941] transition">
             <ArrowLeft size={20} />
          </Link>
          <div>
             <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Kelola Kategori</h1>
             <p className="text-gray-500">Tambah atau hapus kategori produk.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* --- KOLOM KIRI: FORM TAMBAH --- */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E6D5B8] sticky top-24">
              <h2 className="font-bold text-[#4A403A] mb-4 flex items-center gap-2">
                <Plus size={18} /> Tambah Baru
              </h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Kategori</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Meja Belajar" 
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#C87941] text-white font-bold rounded-xl shadow-lg hover:bg-[#b06a38] transition disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : 'Simpan'}
                </button>
              </form>
            </div>
          </div>

          {/* --- KOLOM KANAN: TABEL DAFTAR --- */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-[#E6D5B8] overflow-hidden">
              {isLoading ? (
                <div className="p-10 text-center text-gray-500 animate-pulse">Memuat data...</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-[#FAF8F1] border-b border-[#E6D5B8] text-[#4A403A]">
                    <tr>
                      <th className="p-5 font-bold text-sm uppercase">Nama Kategori</th>
                      <th className="p-5 font-bold text-sm uppercase text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50 transition">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <Tag size={18} />
                              </div>
                              <span className="font-bold text-[#4A403A]">{cat.nama}</span>
                            </div>
                          </td>
                          <td className="p-5 text-right">
                            <button 
                              onClick={() => handleDelete(cat.id, cat.nama)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus Kategori"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-gray-400">
                          Belum ada kategori. Silakan tambah baru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}