'use client';
import { MapPin, Phone, Instagram, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Kontak() {
  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans">
      <Navbar />
      <div className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#4A403A]">Kunjungi Galeri Kami</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lihat langsung proses pembuatan dan koleksi lengkap Ajo Art Creative di workshop kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Card Alamat */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E6D5B8] hover:shadow-md transition group">
            <div className="w-14 h-14 rounded-full bg-[#FDFCF5] flex items-center justify-center mb-6 group-hover:bg-[#E6D5B8] transition">
              <MapPin size={28} className="text-[#C87941]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#4A403A]">Alamat Workshop</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Komplek Asratek, Jl. Pontianak No.2 Blok J, <br/>
              Ulak Karang Sel., Kec. Padang Utara, <br/>
              Kota Padang, Sumatera Barat 25134
            </p>
            <a 
              href="https://maps.app.goo.gl/gX5Q1" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#C87941] font-bold hover:underline text-sm flex items-center gap-1"
            >
              Lihat di Google Maps <ArrowRight size={16}/>
            </a>
          </div>

          {/* Card Kontak */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E6D5B8] hover:shadow-md transition group">
            <div className="w-14 h-14 rounded-full bg-[#FDFCF5] flex items-center justify-center mb-6 group-hover:bg-[#E6D5B8] transition">
              <Phone size={28} className="text-[#C87941]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#4A403A]">Hubungi Kami</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">WhatsApp / Telepon</p>
                <p className="text-lg font-medium text-gray-800">0812-3600-7061</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Instagram</p>
                <a href="https://www.instagram.com/ajoart_creative/" target="_blank" className="text-lg font-medium text-gray-800 hover:text-[#C87941] transition">
                  @ajoart_creative
                </a>
              </div>
            </div>
          </div>

          {/* Card Jam Operasional */}
          <div className="bg-[#4A403A] p-8 rounded-2xl shadow-lg text-[#FDFCF5] relative overflow-hidden">
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
                <span className="font-bold text-[#C87941]">Tutup</span>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2 border-dashed">
                <span className="opacity-80">Sabtu - Minggu</span>
                <span className="font-bold">08.00 – 21.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Maps */}
        <div className="w-full h-[450px] bg-gray-200 rounded-3xl overflow-hidden shadow-inner border-4 border-white">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.3100461763!2d100.3596783!3d-0.9145639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b942e2b117bb%3A0xb88156625110168!2sJl.%20Pontianak%20No.2%2C%20Ulak%20Karang%20Sel.%2C%20Kec.%20Padang%20Utara%2C%20Kota%20Padang%2C%20Sumatera%20Barat%2025134!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
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
