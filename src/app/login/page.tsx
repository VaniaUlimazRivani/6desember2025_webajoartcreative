'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Flame, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // Simulasi Validasi Sederhana
    if (username === 'admin' && password === 'admin') {
      // Simpan status login di localStorage
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Username atau password salah (Gunakan: admin/admin)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF5] px-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-[#E6D5B8]">
        <Link href="/" className="flex items-center gap-2 text-sm text-[#4A403A] mb-8 hover:text-[#C87941] transition font-medium">
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FDFCF5] mb-4 shadow-sm border border-[#E6D5B8]">
             <Flame size={32} className="text-[#C87941]" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#4A403A]">Admin Panel</h2>
          <p className="text-gray-500 mt-2 text-sm">Masuk untuk mengelola Ajo Art Creative</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#4A403A] mb-2">Username</label>
            <div className="relative group">
              <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#C87941] transition" size={20} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#C87941] focus:ring-2 focus:ring-[#C87941]/20 outline-none transition bg-gray-50 focus:bg-white"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#4A403A] mb-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#C87941] transition" size={20} />
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#C87941] focus:ring-2 focus:ring-[#C87941]/20 outline-none transition bg-gray-50 focus:bg-white"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-white bg-[#C87941] hover:bg-[#b06a38] transition transform active:scale-95 shadow-lg shadow-[#C87941]/30"
          >
            Masuk Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}