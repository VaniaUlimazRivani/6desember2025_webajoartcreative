'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, User, Lock, Shield, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',       // Password baru
    confirmPassword: '' // Konfirmasi password
  });

  // --- 1. AMBIL DATA ADMIN ---
  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        // Isi form dengan data database (kecuali password)
        setFormData(prev => ({
          ...prev,
          username: data.username || '',
          email: data.email || ''
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdmin();
  }, []);

  // --- 2. HANDLE INPUT ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. SIMPAN PERUBAHAN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Password Match
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('❌ Password baru dan konfirmasi tidak cocok!');
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password // Kirim password hanya jika diisi
        }),
      });

      if (res.ok) {
        alert('✅ Profil admin berhasil diperbarui!');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); // Reset field password
      } else {
        alert('❌ Gagal memperbarui profil.');
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#FDFCF5] flex items-center justify-center text-gray-500">Memuat profil...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="p-2 rounded-full bg-white border border-[#E6D5B8] text-gray-500 hover:text-[#C87941] transition">
             <ArrowLeft size={20} />
          </Link>
          <div>
             <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Pengaturan Akun</h1>
             <p className="text-gray-500">Kelola profil dan keamanan admin.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* BAGIAN 1: PROFIL UMUM */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <h3 className="font-bold text-lg text-[#4A403A] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <User size={20} className="text-[#C87941]" /> Informasi Profil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                    <input 
                        type="text" name="username"
                        value={formData.username} onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input 
                        type="email" name="email"
                        value={formData.email} onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none"
                    />
                </div>
            </div>
          </div>

          {/* BAGIAN 2: KEAMANAN (PASSWORD) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <h3 className="font-bold text-lg text-[#4A403A] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Lock size={20} className="text-[#C87941]" /> Ganti Password
            </h3>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6 flex gap-3 text-sm text-yellow-800">
                <Shield size={20} />
                <p>Kosongkan bagian ini jika Anda tidak ingin mengubah password.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password Baru</label>
                    <input 
                        type="password" name="password"
                        placeholder="Masukkan password baru..."
                        value={formData.password} onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Password</label>
                    <input 
                        type="password" name="confirmPassword"
                        placeholder="Ulangi password baru..."
                        value={formData.confirmPassword} onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none"
                    />
                </div>
            </div>
          </div>

          {/* TOMBOL SIMPAN */}
          <div className="flex justify-end">
            <button 
                type="submit" 
                disabled={isSaving}
                className="bg-[#4A403A] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#2d2723] hover:scale-105 transition transform flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {isSaving ? 'Menyimpan Perubahan...' : 'Simpan Profil'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}