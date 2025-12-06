'use client';
import { useState } from 'react';
import { Save, Edit, Phone, Mail, MapPin, Instagram } from 'lucide-react';

// Interface Data Konten
interface StaticContent {
  about: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
}

// Data Awal
const initialContent: StaticContent = {
  about: "Ajo Art Creative adalah UMKM yang berfokus pada pengolahan limbah pipa paralon menjadi karya seni bernilai tinggi.",
  address: "Komplek Asratek, Jl. Pontianak No.2 Blok J, Ulak Karang Sel., Kec. Padang Utara, Kota Padang",
  phone: "0812-3600-7061",
  email: "halo@ajoartcreative.com",
  instagram: "@ajoart_creative"
};

export default function ContentPage() {
  const [content, setContent] = useState<StaticContent>(initialContent);

  const handleChange = (key: keyof StaticContent, value: string) => {
    setContent({ ...content, [key]: value });
  };

  const handleSave = () => {
    // Di sini nanti logika API call ke backend
    alert('Perubahan konten berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-[#E6D5B8]">
        <div>
          <h2 className="text-2xl font-bold text-[#4A403A] flex items-center gap-2 font-serif">
            <Edit size={24} className="text-[#C87941]"/> Konten Website
          </h2>
          <p className="text-sm text-gray-500 mt-1">Edit informasi kontak dan deskripsi website secara instan.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#C87941] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#b06a38] shadow-lg transition transform hover:-translate-y-0.5"
        >
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Informasi Dasar */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8]">
          <h3 className="font-bold mb-6 text-lg border-b border-gray-100 pb-4 text-[#4A403A]">Informasi Dasar</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tentang Kami (Footer)</label>
              <textarea 
                rows={5}
                className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#C87941] focus:border-transparent transition text-sm leading-relaxed"
                value={content.about}
                onChange={(e) => handleChange('about', e.target.value)}
              ></textarea>
              <p className="text-xs text-gray-400 mt-2">Teks ini muncul di bagian bawah setiap halaman.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap</label>
              <textarea 
                rows={3}
                className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#C87941] focus:border-transparent transition text-sm"
                value={content.address}
                onChange={(e) => handleChange('address', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Card Kontak */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8]">
          <h3 className="font-bold mb-6 text-lg border-b border-gray-100 pb-4 text-[#4A403A]">Kontak & Sosmed</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nomor WhatsApp</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#C87941] focus:border-transparent transition"
                  value={content.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                <div className="absolute left-4 top-3.5 text-gray-400"><Phone size={18} /></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Bisnis</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#C87941] focus:border-transparent transition"
                  value={content.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <div className="absolute left-4 top-3.5 text-gray-400"><Mail size={18} /></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username Instagram</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#C87941] focus:border-transparent transition"
                  value={content.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                />
                <div className="absolute left-4 top-3.5 text-gray-400"><Instagram size={18} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}