'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Untuk pindah halaman
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Loader2, ImageIcon } from 'lucide-react';

// Tipe data untuk Kategori
interface Kategori {
  id: number;
  nama: string;
}

export default function AddProductPage() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(false); // Loading saat simpan
  const [isUploading, setIsUploading] = useState(false); // Loading saat upload gambar
  const [categories, setCategories] = useState<Kategori[]>([]); // Data kategori dari DB

  // Data Form
  const [formData, setFormData] = useState({
    nama: '',
    harga: '',
    stok: '',
    deskripsi: '',
    kategoriId: '',
    gambar: '' // Nanti diisi URL dari hasil upload
  });

  // --- 1. AMBIL KATEGORI DARI DATABASE ---
  useEffect(() => {
    async function fetchKategori() {
      try {
        const res = await fetch('/api/kategori');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Gagal ambil kategori", err);
      }
    }
    fetchKategori();
  }, []);

  // --- 2. HANDLE UPLOAD GAMBAR ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData,
        });
        const data = await res.json();
        
        if (res.ok) {
            setFormData(prev => ({ ...prev, gambar: data.url }));
        } else {
            alert('Gagal upload gambar: ' + data.error);
        }
    } catch (err) {
        alert('Terjadi kesalahan saat upload.');
    } finally {
        setIsUploading(false);
    }
  };

  // --- 3. HANDLE INPUT CHANGE BIASA ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 4. HANDLE SUBMIT (SIMPAN PRODUK) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload
    setIsLoading(true);

    try {
      const res = await fetch('/api/produk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          harga: Number(formData.harga),
          stok: Number(formData.stok),
          kategoriId: Number(formData.kategoriId),
          deskripsi: formData.deskripsi,
          gambar: formData.gambar
        }),
      });

      if (res.ok) {
        alert('✅ Produk berhasil ditambahkan!');
        router.push('/admin/dashboard'); // Kembali ke dashboard
      } else {
        const err = await res.json();
        alert(`❌ Gagal: ${err.message}`);
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-6">
        <Link href="/admin/dashboard" className="p-2.5 rounded-full bg-white border border-[#E6D5B8] hover:bg-gray-50 transition text-[#4A403A]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#4A403A]">Tambah Produk</h1>
          <p className="text-gray-500 text-sm">Masukkan detail produk kerajinan baru.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Input Data Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8] space-y-5">
            <h3 className="font-bold text-lg border-b border-gray-100 pb-4 mb-4 text-[#4A403A]">Informasi Dasar</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
              <input 
                type="text" 
                name="nama"
                required
                value={formData.nama}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none transition" 
                placeholder="Contoh: Lampu Hias Naga" 
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Harga (Rp)</label>
                <input 
                    type="number" 
                    name="harga"
                    required
                    value={formData.harga}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none transition" 
                    placeholder="0" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stok</label>
                <input 
                    type="number" 
                    name="stok"
                    required
                    value={formData.stok}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none transition" 
                    placeholder="0" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
              <textarea 
                rows={6} 
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none transition" 
                placeholder="Jelaskan keunikan produk ini..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Media & Kategori & Submit */}
        <div className="space-y-6">
          
          {/* Section Upload Media */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <h3 className="font-bold text-lg border-b border-gray-100 pb-4 mb-4 text-[#4A403A]">Media</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:bg-gray-50 transition cursor-pointer group relative overflow-hidden">
                {/* Logika Tampilan: Loading -> Ada Gambar -> Belum Ada Gambar */}
                {isUploading ? (
                     <div className="py-10 flex flex-col items-center text-[#C87941]">
                        <Loader2 className="animate-spin mb-2" />
                        <span className="text-sm">Mengupload...</span>
                     </div>
                ) : formData.gambar ? (
                    <div className="relative">
                        <img src={formData.gambar} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                        <div className="text-xs text-green-600 mt-2 font-bold flex items-center justify-center gap-1">
                            ✅ Gambar Tersimpan
                        </div>
                    </div>
                ) : (
                    <div className="py-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#E6D5B8] transition">
                            <Upload size={24} className="text-gray-400 group-hover:text-[#4A403A]" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Klik untuk upload gambar</p>
                        <p className="text-xs text-gray-400 mt-1">JPG/PNG, Maks 2MB</p>
                    </div>
                )}
              
              {/* Input File Tersembunyi tapi Aktif */}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Section Kategori Dinamis */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
            <select 
                name="kategoriId"
                value={formData.kategoriId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#C87941] outline-none transition"
            >
              <option value="">Pilih Kategori...</option>
              {/* Mapping Data Kategori dari Database */}
              {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nama}
                  </option>
              ))}
            </select>
          </div>

          {/* Tombol Simpan */}
          <button 
            type="submit" 
            disabled={isLoading || isUploading}
            className="w-full py-4 bg-[#C87941] text-white font-bold rounded-xl shadow-lg hover:bg-[#b06a38] transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <>Menyimpan...</>
            ) : (
                <>
                    <Save size={20} /> Simpan Produk
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}