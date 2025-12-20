'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// UBAH DISINI: Ganti TrashX menjadi Trash2
import { ArrowLeft, RefreshCcw, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface Product {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: { nama: string };
  deletedAt: string;
}

export default function HalamanSampah() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // FETCH DATA SAMPAH
  const fetchSampah = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/produk/sampah');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSampah();
  }, []);

  // FUNGSI RESTORE (PULIHKAN)
  const handleRestore = async (id: number) => {
    if(!confirm("Kembalikan produk ini ke daftar aktif?")) return;
    
    setProcessingId(id);
    try {
      const res = await fetch('/api/produk/sampah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id)); // Hapus dari tampilan
      }
    } catch (error) {
      alert("Gagal memulihkan data");
    } finally {
      setProcessingId(null);
    }
  };

  // FUNGSI HAPUS PERMANEN
  const handlePermanentDelete = async (id: number) => {
    if(!confirm("⚠️ PERINGATAN: Data akan dihapus SELAMANYA dan tidak bisa kembali. Yakin?")) return;
    
    setProcessingId(id);
    try {
      const res = await fetch(`/api/produk/sampah?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id)); // Hapus dari tampilan
      }
    } catch (error) {
      alert("Gagal menghapus permanen");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/produk" className="p-2 bg-white rounded-full border border-[#E6D5B8] hover:bg-gray-100 transition">
              <ArrowLeft size={20} className="text-[#4A403A]" />
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-red-800 flex items-center gap-2">
                {/* UBAH DISINI JUGA */}
                <Trash2 size={32} /> Data Sampah
              </h1>
              <p className="text-gray-500 text-sm">Kelola produk yang telah dihapus sementara.</p>
            </div>
          </div>
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm border border-red-100 flex items-center gap-2">
            <AlertTriangle size={16} />
            Hapus Permanen tidak dapat dibatalkan.
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E6D5B8] overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500 flex justify-center items-center gap-2">
               <Loader2 className="animate-spin" /> Memuat sampah...
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-lg font-bold text-[#4A403A]">Data Sampah Kosong</h3>
              <p className="text-gray-400">Tidak ada produk yang dihapus.</p>
              <Link href="/admin/produk" className="mt-4 inline-block text-[#C87941] font-bold hover:underline">
                Kembali ke Daftar Produk
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-red-50 text-red-900 border-b border-red-100">
                  <tr>
                    <th className="p-4 font-bold uppercase text-xs tracking-wider">Produk</th>
                    <th className="p-4 font-bold uppercase text-xs tracking-wider">Kategori</th>
                    <th className="p-4 font-bold uppercase text-xs tracking-wider">Dihapus Pada</th>
                    <th className="p-4 font-bold uppercase text-xs tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-red-50/30 transition">
                      <td className="p-4 font-medium text-[#4A403A]">{p.nama}</td>
                      <td className="p-4 text-gray-500 text-sm">{p.kategori?.nama}</td>
                      <td className="p-4 text-gray-400 text-sm italic">
                        {new Date(p.deletedAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          
                          {/* Tombol Restore */}
                          <button 
                            onClick={() => handleRestore(p.id)}
                            disabled={processingId === p.id}
                            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2 text-sm font-bold transition disabled:opacity-50"
                            title="Kembalikan ke aktif"
                          >
                            {processingId === p.id ? <Loader2 size={16} className="animate-spin"/> : <RefreshCcw size={16} />} 
                            <span className="hidden md:inline">Pulihkan</span>
                          </button>

                          {/* Tombol Hapus Permanen */}
                          <button 
                            onClick={() => handlePermanentDelete(p.id)}
                            disabled={processingId === p.id}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-bold transition shadow-sm hover:shadow-md disabled:opacity-50"
                            title="Hapus Selamanya"
                          >
                             {/* UBAH DISINI JUGA: Trash2 */}
                             {processingId === p.id ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
                             <span className="hidden md:inline">Hapus Permanen</span>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}