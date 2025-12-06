'use client';
import { Save, User, Shield, KeyRound } from 'lucide-react';

export default function SettingsPage() {
  const handleSave = (section: string) => {
    alert(`Perubahan ${section} berhasil disimpan!`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-serif font-bold text-[#4A403A]">Pengaturan Akun</h2>
        <p className="text-gray-500 mt-2">Kelola informasi profil admin dan keamanan akun Anda.</p>
      </div>

      {/* Card Profil */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8]">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="p-3 bg-[#FDFCF5] rounded-xl text-[#C87941]">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-bold text-xl text-[#4A403A]">Profil Admin</h3>
            <p className="text-sm text-gray-400">Informasi identitas pengelola website</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4 mx-auto md:mx-0">
            <div className="w-28 h-28 rounded-full bg-[#4A403A] text-white flex items-center justify-center text-3xl font-bold border-4 border-[#FDFCF5] shadow-lg">
              VU
            </div>
            <button className="text-sm text-[#C87941] font-bold hover:underline">Ubah Foto</button>
          </div>
          
          <div className="flex-1 space-y-5 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Depan</label>
                <input type="text" defaultValue="Vania" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Belakang</label>
                <input type="text" defaultValue="Ulimaz" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="email" defaultValue="admin@ajoart.com" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" />
            </div>
            <div className="pt-4 text-right">
              <button 
                onClick={() => handleSave('Profil')} 
                className="bg-[#4A403A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#362f2b] transition shadow-md"
              >
                Simpan Profil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Keamanan */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8]">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="p-3 bg-[#FDFCF5] rounded-xl text-[#C87941]">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-bold text-xl text-[#4A403A]">Keamanan</h3>
            <p className="text-sm text-gray-400">Ubah password akun Anda</p>
          </div>
        </div>

        <div className="space-y-5 max-w-lg">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password Saat Ini</label>
            <div className="relative">
                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none transition" />
                <KeyRound className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password Baru</label>
            <div className="relative">
                <input type="password" placeholder="Minimal 8 karakter" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none transition" />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Password Baru</label>
            <div className="relative">
                <input type="password" placeholder="Ulangi password baru" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none transition" />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>
          <div className="pt-4">
            <button 
              onClick={() => handleSave('Password')}
              className="bg-[#C87941] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#b06a38] shadow-lg transition w-full justify-center transform hover:-translate-y-0.5"
            >
              <Save size={20} /> Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// Helper component
function Lock({ className, size }: { className?: string, size?: number }) {
    return <Shield className={className} size={size} />; // Menggunakan Shield sementara sebagai icon Lock jika tidak import
}