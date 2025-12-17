'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Layout, Info, Phone, Loader2 } from 'lucide-react';

export default function KontenWebPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State Default (Nilai awal kosong)
  const [formData, setFormData] = useState({
    hero_judul: '',
    hero_deskripsi: '',
    tentang_kami: '',
    kontak_wa: '',
    kontak_alamat: '',
    kontak_email: '',
    sosmed_ig: ''
  });

  // --- 1. AMBIL DATA SAAT HALAMAN DIBUKA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/konten', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          // Gabungkan data DB dengan default state agar tidak error
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Gagal ambil konten", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. HANDLE KETIK ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 3. SIMPAN DATA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/konten', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('✅ Pengaturan berhasil disimpan!');
      } else {
        const err = await res.json();
        alert('❌ Gagal: ' + err.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#FDFCF5] flex items-center justify-center">
            <Loader2 className="animate-spin text-[#C87941] mr-2" />
            <span className="text-gray-500">Memuat pengaturan...</span>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans p-8 animate-fade-in pb-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="p-2 rounded-full bg-white border border-[#E6D5B8] text-gray-500 hover:text-[#C87941] transition">
             <ArrowLeft size={20} />
          </Link>
          <div>
             <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Konten Website</h1>
             <p className="text-gray-500">Ubah teks halaman depan tanpa coding.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Form Hero */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <h3 className="font-bold text-lg text-[#4A403A] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Layout size={20} className="text-[#C87941]" /> Halaman Depan (Hero)
            </h3>
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Judul Utama</label>
                    <input type="text" name="hero_judul" value={formData.hero_judul} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none" placeholder="Judul besar di halaman depan" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Singkat</label>
                    <textarea name="hero_deskripsi" rows={3} value={formData.hero_deskripsi} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none" placeholder="Teks kecil di bawah judul" />
                </div>
            </div>
          </div>

          {/* Form Tentang Kami */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <h3 className="font-bold text-lg text-[#4A403A] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Info size={20} className="text-[#C87941]" /> Tentang Kami
            </h3>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Profil Singkat</label>
                <textarea name="tentang_kami" rows={5} value={formData.tentang_kami} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none" placeholder="Cerita singkat tentang toko Anda..." />
            </div>
          </div>

          {/* Form Kontak */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <h3 className="font-bold text-lg text-[#4A403A] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Phone size={20} className="text-[#C87941]" /> Kontak
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp</label>
                    <input type="text" name="kontak_wa" value={formData.kontak_wa} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none" placeholder="62812..." />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input type="email" name="kontak_email" value={formData.kontak_email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none" placeholder="admin@ajoart.com" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Alamat</label>
                    <textarea name="kontak_alamat" rows={2} value={formData.kontak_alamat} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none" placeholder="Alamat lengkap toko..." />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Instagram Link</label>
                    <input type="text" name="sosmed_ig" value={formData.sosmed_ig} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none" placeholder="https://instagram.com/..." />
                </div>
            </div>
          </div>

          {/* Tombol Simpan Melayang */}
          <div className="fixed bottom-8 right-8 z-50">
            <button 
                type="submit" 
                disabled={isSaving}
                className="bg-[#4A403A] text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-[#2d2723] hover:scale-105 transition transform flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed border-2 border-[#C87941]"
            >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}