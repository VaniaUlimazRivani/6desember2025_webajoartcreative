'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Instagram, Clock, ArrowRight, Mail, Loader2 } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';

export default function Kontak() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Default State (Data cadangan jika database kosong)
  const [content, setContent] = useState({
    kontak_alamat: 'Komplek Asratek, Jl. Pontianak No.2 Blok J, Ulak Karang Sel., Kota Padang',
    kontak_wa: '6281236007061',
    kontak_email: 'admin@ajoart.com',
    sosmed_ig: 'https://instagram.com/ajoart_creative',
  });

  // --- AMBIL DATA DARI DATABASE ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/konten');
        const data = await res.json();

        // Update jika data ada di database
        if (data.kontak_wa) {
          setContent(prev => ({
            ...prev,
            ...data // Timpa data default dengan data dari DB
          }));
        }
      } catch (error) {
        console.error("Gagal memuat kontak:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#4A403A]">Kunjungi Galeri Kami</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lihat langsung proses pembuatan dan koleksi lengkap Ajo Art Creative di workshop kami.
          </p>
        </div>

        {isLoading ? (
           <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#C87941]" size={40} />
           </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Card Alamat */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E6D5B8] hover:shadow-md transition group h-full">
            <div className="w-14 h-14 rounded-full bg-[#FDFCF5] flex items-center justify-center mb-6 group-hover:bg-[#E6D5B8] transition">
              <MapPin size={28} className="text-[#C87941]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#4A403A]">Alamat Workshop</h3>
            <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
              {content.kontak_alamat}
            </p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.kontak_alamat)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#C87941] font-bold hover:underline text-sm flex items-center gap-1"
            >
              Lihat di Google Maps <ArrowRight size={16}/>
            </a>
          </div>

          {/* Card Kontak */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E6D5B8] hover:shadow-md transition group h-full">
            <div className="w-14 h-14 rounded-full bg-[#FDFCF5] flex items-center justify-center mb-6 group-hover:bg-[#E6D5B8] transition">
              <Phone size={28} className="text-[#C87941]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#4A403A]">Hubungi Kami</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">WhatsApp / Telepon</p>
                <a href={`https://wa.me/${content.kontak_wa}`} target="_blank" className="text-lg font-medium text-gray-800 hover:text-[#C87941] transition block">
                  +{content.kontak_wa}
                </a>
              </div>
              
              {/* Tambahan Email */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <a href={`mailto:${content.kontak_email}`} className="text-lg font-medium text-gray-800 hover:text-[#C87941] transition block">
                  {content.kontak_email}
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Instagram</p>
                <a href={content.sosmed_ig} target="_blank" className="text-lg font-medium text-gray-800 hover:text-[#C87941] transition flex items-center gap-2">
                  <Instagram size={18} /> @ajoart_creative
                </a>
              </div>
            </div>
          </div>

          {/* Card Jam Operasional (Statis) */}
          <div className="bg-[#4A403A] p-8 rounded-2xl shadow-lg text-[#FDFCF5] relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C87941] rounded-full filter blur-[60px] opacity-20"></div>
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6 relative z-10">
              <Clock size={28} color="#FDFCF5" />
            </div>
            <h3 className="text-xl font-bold mb-6 relative z-10">Jam Operasional</h3>
            <div className="space-y-3 text-sm relative z-10">
              <div className="flex justify-between border-b border-gray-600 pb-2 border-dashed">
                <span className="opacity-80">Senin - Kamis</span>
                <span className="font-bold">08.00 – 21.00</span>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2 border-dashed">
                <span className="opacity-80">Jumat</span>
                <span className="font-bold text-[#C87941]">13.00 – 21.00</span>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2 border-dashed">
                <span className="opacity-80">Sabtu - Minggu</span>
                <span className="font-bold">08.00 – 22.00</span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Maps Embed */}
        <div className="w-full h-[450px] bg-gray-200 rounded-3xl overflow-hidden shadow-inner border-4 border-white animate-fade-in">
          {/* Ganti src ini dengan Link Embed Google Maps lokasi Asli Anda */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.291734377073!2d100.35368307583152!3d-0.9308696353412577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b93bd0569817%3A0xe54930252327593c!2sPadang%2C%20Padang%20City%2C%20West%20Sumatra!5e0!3m2!1sen!2sid!4v1709623824321!5m2!1sen!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}