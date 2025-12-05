// app/page.tsx
import Link from "next/link";
import { ArrowRight, Flame, Star, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { keunggulan, productsData, testimonials } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCF5] text-[#2D2420] font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <header className="relative h-[85vh] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image (pastikan file public/lampu-hias.webp ada) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/lampuhias.webp"
            alt="Lampu Hias Paralon"
            className="w-full h-full object-cover brightness-[0.55]"
            loading="lazy"
          />

          {/* Overlay halus */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30" />

          {/* Gradient transisi hero -> section berikut */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#4A403A]" />
        </div>

        {/* Konten */}
        <div className="relative z-10 max-w-5xl space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C87941] bg-[#4A403A]/70 text-[#C87941] text-sm font-bold tracking-widest mb-4 backdrop-blur-sm">
            <Flame size={14} /> KERAJINAN TANGAN ASLI PADANG
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-white leading-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
            Seni Cahaya & <span className="text-[#C87941]">Karya Bakar</span>
          </h1>

          {/* Penting: gunakan warna teks putih karena background gelap */}
          <p className="text-base md:text-xl text-white/95 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Menyulap limbah paralon menjadi mahakarya interior yang estetik, fungsional, dan bernilai seni tinggi.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/katalog"
              className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-br from-[#C87941] to-[#A55E2F] hover:scale-105 transition transform flex items-center justify-center gap-2 shadow-xl"
            >
              Jelajahi Katalog <ArrowRight size={20} />
            </Link>

            <Link
              href="/kontak"
              className="px-8 py-4 rounded-full font-bold text-[#4A403A] bg-white/90 hover:bg-white transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </header>

      {/* 2. KEUNGGULAN */}
      <section className="py-16 px-4 bg-[#4A403A] text-white relative z-20">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4 text-[#FDFCF5]">Kenapa Memilih Ajo Art?</h2>
          <p className="text-gray-300">Kombinasi sempurna antara pelestarian lingkungan dan estetika.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {keunggulan.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 border border-gray-700 rounded-2xl hover:border-[#C87941] transition duration-300 group bg-[#3E3530] hover:bg-[#352d29]"
              >
                <div className="mb-4 inline-block p-3 rounded-full bg-[#2D2420] group-hover:bg-[#C87941] transition duration-300">
                  <Icon size={28} className="text-[#C87941] group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#FDFCF5]">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. KOLEKSI UNGGULAN */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-serif font-bold text-[#4A403A]">Koleksi Favorit</h2>
            <p className="mt-2 text-lg text-gray-500">Pilihan terbaik pelanggan kami bulan ini</p>
          </div>
          <Link href="/katalog" className="text-[#C87941] font-bold hover:underline flex items-center gap-1 group">
            Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsData.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 border border-[#E6D5B8] transform hover:-translate-y-2"
            >
              <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/90 text-[#4A403A] px-3 py-1 rounded-full text-sm font-bold shadow">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <Link
                    href={`/produk/${product.id}`}
                    className="bg-white text-[#4A403A] px-5 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-500 hover:bg-[#C87941] hover:text-white flex items-center gap-2 shadow-lg"
                  >
                    <ShoppingBag size={18} /> Detail
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold uppercase tracking-wider mb-2 text-[#C87941]">{product.category}</div>
                <h3 className="text-xl font-bold mb-2 text-[#4A403A]">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-[#C87941]">Rp {product.price.toLocaleString("id-ID")}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star size={14} fill="#f59e0b" stroke="none" /> {product.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TESTIMONI */}
      <section className="py-24 px-4 bg-[#F8F7F2]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-serif font-bold mb-12 text-[#4A403A]">Kata Mereka Tentang Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testi) => (
              <blockquote key={testi.id} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E6D5B8] relative hover:-translate-y-2 transition duration-300">
                <div className="text-4xl text-[#C87941] mb-2">“</div>
                <div className="flex gap-1 mb-4 mt-2">
                  {[...Array(testi.rating)].map((_, i) => <Star key={i} size={16} fill="#C87941" stroke="none" />)}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testi.text}"</p>
                <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                  <div className="w-10 h-10 rounded-full bg-[#E6D5B8] flex items-center justify-center font-bold text-[#4A403A]">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A403A]">{testi.name}</h4>
                    <span className="text-xs text-gray-400">{testi.from}</span>
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-24 px-4 bg-[#E6D5B8]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-serif font-bold mb-12 text-[#4A403A]">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {[
              { q: "Apakah produk ini tahan lama?", a: "Sangat tahan lama. Kami menggunakan bahan PVC tebal yang anti pecah, anti rayap, dan tahan air." },
              { q: "Bagaimana cara membersihkannya?", a: "Cukup dilap dengan kain lembab. Jangan menggunakan cairan kimia keras agar lapisan pernis tetap awet." },
              { q: "Apakah bisa kirim ke luar kota?", a: "Ya, kami melayani pengiriman ke seluruh Indonesia dengan packing kayu aman." },
              { q: "Berapa lama proses pembuatan custom?", a: "Tergantung kerumitan, biasanya memakan waktu 3-7 hari kerja." },
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-xl border border-[#D4C4B0] hover:border-[#C87941] transition cursor-pointer shadow-sm">
                <summary className="p-6 font-bold text-lg flex items-center justify-between select-none text-[#4A403A]">
                  <span className="flex items-center gap-3">
                    <span className="text-[#C87941] font-serif italic text-2xl">Q:</span> {item.q}
                  </span>
                  <span className="transform group-open:rotate-180 transition text-[#C87941]">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 border-t border-[#D4C4B0] pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
