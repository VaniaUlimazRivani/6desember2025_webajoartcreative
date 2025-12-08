'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Flame, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false); // Tambahkan state loading
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Panggil API Login Backend yang sudah kita buat
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Jika sukses, backend sudah set Cookie secara otomatis.
        // Kita tinggal redirect ke dashboard.
        router.push('/admin/dashboard');
      } else {
        // Tampilkan pesan error dari backend (misal: "Password salah")
        setError(data.message || 'Login gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF5] px-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-[#E6D5B8]">
        
        {/* Tombol Kembali */}
        <Link href="/" className="flex items-center gap-2 text-sm text-[#4A403A] mb-8 hover:text-[#C87941] transition font-medium w-fit">
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FDFCF5] mb-4 shadow-sm border border-[#E6D5B8]">
             <Flame size={32} className="text-[#C87941]" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#4A403A]">Admin Panel</h2>
          <p className="text-gray-500 mt-2 text-sm">Masuk untuk mengelola Ajo Art Creative</p>
        </div>

        {/* Pesan Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100 animate-pulse">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Input Username */}
          <div>
            <label className="block text-sm font-bold text-[#4A403A] mb-2">Username</label>
            <div className="relative group">
              <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#C87941] transition" size={20} />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#C87941] focus:ring-2 focus:ring-[#C87941]/20 outline-none transition bg-gray-50 focus:bg-white text-[#4A403A]"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          {/* Input Password */}
          <div>
            <label className="block text-sm font-bold text-[#4A403A] mb-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#C87941] transition" size={20} />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#C87941] focus:ring-2 focus:ring-[#C87941]/20 outline-none transition bg-gray-50 focus:bg-white text-[#4A403A]"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#C87941] hover:bg-[#b06a38] transition transform active:scale-95 shadow-lg shadow-[#C87941]/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <> <Loader2 className="animate-spin" /> Memproses... </>
            ) : (
                'Masuk Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}