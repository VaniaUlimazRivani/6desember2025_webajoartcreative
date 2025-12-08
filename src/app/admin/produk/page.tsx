'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, ArrowLeft, Eye } from 'lucide-react';

// Interface sesuai dengan Database Prisma
interface Product {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: { nama: string };
  gambar: string;
}

export default function AdminProductListPage() {
  // Inisialisasi state dengan array kosong []
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. AMBIL DATA PRODUK (READ) ---
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/produk');
      const data = await res.json();
      
      // PERBAIKAN PENTING: Cek apakah data benar-benar Array
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Data API bukan array:", data);
        setProducts([]); // Paksa jadi array kosong jika format salah
      }
    } catch (error) {
      console.error('Gagal ambil data', error);
      setProducts([]); // Paksa jadi array kosong jika error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. HANDLE HAPUS PRODUK (DELETE) ---
  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Yakin ingin menghapus produk "${nama}"?`)) return;

    try {
      const res = await fetch(`/api/produk/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Produk berhasil dihapus');
        fetchProducts(); // Refresh data otomatis
      } else {
        alert('Gagal menghapus produk');
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem');
    }
  };

  // --- 3. FILTER PENCARIAN (Dengan Safety Check) ---
  // (products || []) memastikan kode tidak crash meskipun products null/undefined
  const filteredProducts = (products || []).filter(p => 
    p.nama && p.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 rounded-full bg-white border border-[#E6D5B8] text-gray-500 hover:text-[#C87941] transition">
                <ArrowLeft size={20} />
            </Link>
            <div>
                <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Daftar Produk</h1>
                <p className="text-gray-500">Kelola katalog produk kerajinan Ajo Art.</p>
            </div>
          </div>
          
          <Link 
            href="/admin/produk/tambah"
            className="bg-[#C87941] hover:bg-[#b06a38] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg transform hover:-translate-y-1"
          >
            <Plus size={20} /> Tambah Produk Baru
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E6D5B8] mb-8 flex items-center gap-3">
          <Search className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama produk..." 
            className="w-full outline-none text-gray-700 placeholder-gray-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabel Produk */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E6D5B8] overflow-hidden">
          {isLoading ? (
             <div className="p-10 text-center text-gray-500 animate-pulse">Memuat data produk...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F1] border-b border-[#E6D5B8] text-[#4A403A]">
                    <th className="p-6 font-bold text-sm uppercase tracking-wider">Produk</th>
                    <th className="p-6 font-bold text-sm uppercase tracking-wider">Kategori</th>
                    <th className="p-6 font-bold text-sm uppercase tracking-wider">Harga</th>
                    <th className="p-6 font-bold text-sm uppercase tracking-wider">Stok</th>
                    <th className="p-6 font-bold text-sm uppercase tracking-wider">Status</th>
                    <th className="p-6 font-bold text-sm uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition group">
                        {/* Kolom Produk (Gambar & Nama) */}
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                <img 
                                  src={item.gambar || 'https://via.placeholder.com/100?text=No+Img'} 
                                  alt={item.nama} 
                                  className="w-full h-full object-cover" 
                                />
                            </div>
                            <span className="font-bold text-[#4A403A]">{item.nama}</span>
                          </div>
                        </td>
                        
                        {/* Kolom Kategori */}
                        <td className="p-6">
                           <span className="bg-[#E6D5B8]/30 text-[#C87941] px-3 py-1 rounded-full text-xs font-bold uppercase">
                             {item.kategori?.nama || 'Umum'}
                           </span>
                        </td>
                        
                        {/* Kolom Harga */}
                        <td className="p-6 text-gray-600 font-medium">
                           Rp {item.harga.toLocaleString('id-ID')}
                        </td>
                        
                        {/* Kolom Stok */}
                        <td className="p-6 text-gray-600">
                           {item.stok} unit
                        </td>

                        {/* Kolom Status */}
                        <td className="p-6">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {item.stok > 0 ? 'Aktif' : 'Habis'}
                           </span>
                        </td>
                        
                        {/* Kolom Aksi */}
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-2">
                             {/* Tombol Lihat */}
                             <Link href={`/katalog/${item.id}`} target="_blank" className="p-2 text-gray-400 hover:text-[#4A403A] hover:bg-gray-100 rounded-lg transition" title="Lihat di Web">
                                <Eye size={18} />
                             </Link>

                             {/* Tombol Edit */}
                             <Link href={`/admin/edit-produk/${item.id}`} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                <Edit size={18} />
                             </Link>

                             {/* Tombol Hapus */}
                             <button 
                                onClick={() => handleDelete(item.id, item.nama)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                                title="Hapus"
                             >
                                <Trash2 size={18} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-gray-400">
                        Tidak ada produk yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}