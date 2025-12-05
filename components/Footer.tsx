import { Flame, Instagram, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 bg-[#4A403A] text-[#E6D5B8]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Flame size={28} className="text-[#C87941]" />
            <span className="text-2xl font-serif font-bold text-[#FDFCF5]">Ajo Art Creative</span>
          </div>
          <p className="opacity-80 leading-relaxed max-w-sm mb-6">
            Mengubah limbah paralon menjadi karya seni fungsional bernilai tinggi.
            Komplek Asratek, Jl. Pontianak No.2 Blok J, Ulak Karang Sel., Padang.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/ajoart_creative/" target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-[#C87941] hover:text-white transition duration-300">
              <Instagram size={20} />
            </a>
            <a href="https://wa.me/6281236007061" target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-[#C87941] hover:text-white transition duration-300">
              <Phone size={20} />
            </a>
          </div>
        </div>
        
        {/* Navigasi */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-[#FDFCF5]">Tautan</h4>
          <ul className="space-y-3 opacity-80">
            <li><a href="/" className="hover:text-[#C87941] transition">Beranda</a></li>
            <li><a href="/katalog" className="hover:text-[#C87941] transition">Katalog Produk</a></li>
            <li><a href="/kontak" className="hover:text-[#C87941] transition">Lokasi</a></li>
          </ul>
        </div>

        {/* Kontak Cepat */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-[#FDFCF5]">Hubungi Kami</h4>
          <ul className="space-y-3 opacity-80">
            <li className="flex items-start gap-2">
              <Phone size={18} className="mt-1 shrink-0"/> 
              <span>0812-3600-7061</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={18} className="mt-1 shrink-0"/> 
              <span>Kota Padang, Sumatera Barat</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-8 text-center text-sm opacity-60">
        &copy; 2025 Ajo Art Creative. Dibuat dengan bangga di Ranah Minang.
      </div>
    </footer>
  );
}