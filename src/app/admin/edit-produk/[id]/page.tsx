'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // useParams untuk ambil ID
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';

interface Kategori {
  id: number;
  nama: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id; // Ambil ID dari URL

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Loading saat ambil data awal
  const [categories, setCategories] = useState<Kategori[]>([]);

  const [formData, setFormData] = useState({
    nama: '',
    harga: '',
    stok: '',
    deskripsi: '',
    kategoriId: '',
    gambar: ''
  });

  // --- 1. AMBIL DATA PRODUK & KATEGORI ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil Daftar Kategori
        const resKat = await fetch('/api/kategori');
        const dataKat = await resKat.json();
        setCategories(dataKat);

        // Ambil Data Produk yang mau diedit
        const resProd = await fetch(`/api/produk/${productId}`);
        if (!resProd.ok) throw new Error('Produk tidak ditemukan');
        const dataProd = await resProd.json();

        // Isi form dengan data yang ada
        setFormData({
          nama: dataProd.nama,
          harga: dataProd.harga.toString(),
          stok: dataProd.stok.toString(),
          deskripsi: dataProd.deskripsi || '',
          kategoriId: dataProd.kategoriId.toString(),
          gambar: dataProd.gambar || ''
        });
      } catch (error) {
        console.error(error);
        alert('Gagal mengambil data produk.');
        router.push('/admin/produk'); // Kembali jika error
      } finally {
        setIsFetching(false);
      }
    };

    if (productId) fetchData();
  }, [productId, router]);

  // --- 2. HANDLE UPLOAD GAMBAR (Sama seperti Tambah Produk) ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
        const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const data = await res.json();
        if (res.ok) {
            setFormData(prev => ({ ...prev, gambar: data.url }));
        } else {
            alert('Gagal upload: ' + data.error);
        }
    } catch (err) {
        alert('Terjadi kesalahan saat upload.');
    } finally {
        setIsUploading(false);
    }
  };

  // --- 3. HANDLE PERUBAHAN INPUT ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 4. HANDLE SUBMIT (UPDATE / PATCH) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Perbedaan utama: Method PATCH dan URL ada ID-nya
      const res = await fetch(`/api/produk/${productId}`, {
        method: 'PATCH',
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
        alert('✅ Produk berhasil diperbarui!');
        router.push('/admin/produk'); // Kembali ke daftar produk
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

  if (isFetching) {
    return (
        <div className="min-h-screen bg-[#FDFCF5] flex items-center justify-center">
            <p className="text-gray-500 animate-pulse text-lg">Mengambil data produk...</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10 bg-[#FDFCF5] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-10 px-4">
        <Link href="/admin/produk" className="p-2.5 rounded-full bg-white border border-[#E6D5B8] hover:bg-gray-50 transition text-[#4A403A]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#4A403A]">Edit Produk</h1>
          <p className="text-gray-500 text-sm">Perbarui informasi produk ini.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        
        {/* Kolom Kiri: Input Data Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8] space-y-5">
            <h3 className="font-bold text-lg border-b border-gray-100 pb-4 mb-4 text-[#4A403A]">Informasi Dasar</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
              <input 
                type="text" name="nama" required value={formData.nama} onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Harga (Rp)</label>
                <input 
                    type="number" name="harga" required value={formData.harga} onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stok</label>
                <input 
                    type="number" name="stok" required value={formData.stok} onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
              <textarea 
                rows={6} name="deskripsi" value={formData.deskripsi} onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none" 
              ></textarea>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Media & Kategori */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <h3 className="font-bold text-lg border-b border-gray-100 pb-4 mb-4 text-[#4A403A]">Media</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:bg-gray-50 transition cursor-pointer group relative overflow-hidden">
                {isUploading ? (
                     <div className="py-10 flex flex-col items-center text-[#C87941]">
                        <Loader2 className="animate-spin mb-2" />
                        <span className="text-sm">Mengupload...</span>
                     </div>
                ) : formData.gambar ? (
                    <div className="relative">
                        <img src={formData.gambar} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <p className="text-white text-sm font-bold">Klik untuk Ganti</p>
                        </div>
                    </div>
                ) : (
                    <div className="py-6">
                        <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload Gambar Baru</p>
                    </div>
                )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
            <select 
                name="kategoriId" value={formData.kategoriId} onChange={handleChange} required
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#C87941] outline-none"
            >
              <option value="">Pilih Kategori...</option>
              {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nama}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" disabled={isLoading || isUploading}
            className="w-full py-4 bg-[#C87941] text-white font-bold rounded-xl shadow-lg hover:bg-[#b06a38] transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? 'Menyimpan...' : ( <><Save size={20} /> Simpan Perubahan</> )}
          </button>
        </div>
      </form>
    </div>
  );
}