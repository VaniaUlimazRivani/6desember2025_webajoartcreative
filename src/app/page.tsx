'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Flame, Truck, ArrowRight, ChevronLeft, ChevronRight, Loader2, Star } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import ScrollReveal from '@/components/ui/ScrollReveal';


// --- INTERFACES ---
interface Product {
  id: number;
  nama: string;
  harga: number;
  gambar: string | null;
  kategori: { nama: string };
  rating?: number;
}

interface Testimoni {
  id: number;
  name: string;
  text: string;
  rating: number;
  date: string;
}

interface WebContent {
  hero_judul: string;
  hero_deskripsi: string;
  tentang_kami?: string;
}

// Data Keunggulan (Statis)
const keunggulan = [
  { icon: Award, title: 'Kualitas Premium', desc: 'Menggunakan bahan paralon Grade A dengan teknik bakar khusus.' },
  { icon: ShieldCheck, title: 'Tahan Lama', desc: 'Finishing pernis anti rayap dan tahan cuaca untuk penggunaan jangka panjang.' },
  { icon: Flame, title: 'Seni Ukir Bakar', desc: 'Teknik pembakaran unik menciptakan gradasi warna alami yang artistik.' },
  { icon: Truck, title: 'Pengiriman Aman', desc: 'Packing kayu & bubble wrap tebal menjamin barang sampai dengan selamat.' },
];

export default function Home() {
  // --- STATE DATA ---
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimoni[]>([]);
  const [content, setContent] = useState<WebContent>({
  hero_judul: 'Seni Cahaya & Karya Bakar',
  hero_deskripsi: 'Menyulap limbah paralon menjadi mahakarya interior yang estetik, fungsional, dan bernilai seni tinggi.',
  tentang_kami: ''
});

  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

  // --- REF UNTUK HORIZONTAL SCROLL ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- AMBIL DATA DARI BACKEND ---
  useEffect(() => {
    async function fetchData() {
      try {
        // Panggil 3 API sekaligus (Konten, Produk, Testimoni)
        const [resKonten, resProduk, resTesti] = await Promise.all([
          fetch('/api/konten'),
          fetch('/api/produk'),
          fetch('/api/testimoni')
        ]);

        const dataKonten = await resKonten.json();
        const dataProduk = await resProduk.json();
        const dataTesti = await resTesti.json();

        // 1. Set Konten Web (PERBAIKAN)
        setContent({
          hero_judul: dataKonten.hero_judul || content.hero_judul,
          hero_deskripsi: dataKonten.hero_deskripsi || content.hero_deskripsi,
          tentang_kami: dataKonten.tentang_kami || ''
        });

        // 2. Set Produk (Ambil semua untuk scroll horizontal)
        if (Array.isArray(dataProduk)) {
          setProducts(dataProduk);
        }

        // 3. Set Testimoni (Ambil 3 Teratas yg Published)
        if (Array.isArray(dataTesti)) {
          // Filter hanya yang status Published
          const publishedTesti = dataTesti.filter((t: any) => t.status === 'Published').slice(0, 3);
          setTestimonials(publishedTesti);
        }

      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- FUNGSI SCROLL HORIZONTAL ---
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Lebar satu card + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF5] text-[#2D2420] font-sans">
      <Navbar />

      {/* 1. HERO SECTION (DINAMIS DARI DB) */}
      <header className="relative h-[85vh] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/lampuhias.webp" 
            alt="Lampu Hias Paralon"
            className="w-full h-full object-cover brightness-[0.55]"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1513506003013-194a5d68d878?auto=format&fit=crop&q=80&w=1920')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#4A403A]" />
        </div>

        {/* Konten Hero */}
        <div className="relative z-10 max-w-5xl space-y-6 px-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C87941] bg-[#4A403A]/70 text-[#C87941] text-sm font-bold tracking-widest mb-4 backdrop-blur-sm">
            <Flame size={14} /> KERAJINAN TANGAN ASLI PADANG
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-white leading-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
            {content.hero_judul}
          </h1>

          <p className="text-base md:text-xl text-white/95 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {content.hero_deskripsi}
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
            href="/katalog"
            className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-br from-[#C87941] to-[#A55E2F] hover:scale-105 transition transform flex items-center justify-center shadow-xl"
          >
            Jelajahi Katalog
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

      {/* 2. KEUNGGULAN (STATIS) */}
      <section className="py-16 px-4 bg-[#4A403A] text-white relative z-20">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4 text-[#FDFCF5]">Kenapa Memilih Ajo Art?</h2>
          <p className="text-gray-300">Kombinasi sempurna antara pelestarian lingkungan dan estetika.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {keunggulan.map((item, idx) => {
          const Icon = item.icon;
          return (
            <ScrollReveal key={idx} delay={idx * 0.15}>
              <div
                className="p-6 border border-gray-700 rounded-2xl hover:border-[#C87941] transition duration-300 group bg-[#3E3530] hover:bg-[#352d29]"
              >
                <div className="mb-4 inline-block p-3 rounded-full bg-[#2D2420] group-hover:bg-[#C87941] transition duration-300">
                  <Icon size={28} className="text-[#C87941] group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#FDFCF5]">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          );
        })}

        </div>
      </section>

      {/* TENTANG KAMI */}
      <section className="py-24 px-4 bg-[#F8F7F2]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* FOTO */}
          <ScrollReveal>
            <div className="relative">
              <img
                src="/tentang-kami.jpg"
                alt="Tentang Ajo Art"
                className="w-full h-[420px] object-cover rounded-3xl shadow-lg"
                loading="lazy"
                onError={(e) =>
                  (e.currentTarget.src =
                    'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&q=80&w=1200')
                }
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5" />
            </div>
          </ScrollReveal>

          {/* TEKS */}
          <ScrollReveal delay={0.2}>
            <div>
              <h2 className="text-4xl font-serif font-bold text-[#4A403A] mb-6">
                Tentang Kami
              </h2>

              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {content.tentang_kami || 
                  'Informasi tentang kami belum tersedia. Silakan lengkapi melalui halaman Konten Website.'}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* 3. KOLEKSI TERBARU - HORIZONTAL SCROLL */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-serif font-bold text-[#4A403A]">Koleksi Terbaru</h2>
              <p className="mt-2 text-lg text-gray-500">Pilihan terbaik pelanggan kami bulan ini</p>
            </div>
            <Link href="/katalog" className="text-[#C87941] font-bold hover:underline flex items-center gap-1 group">
              Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Horizontal Scroll Container */}
          <ScrollReveal>
            <div className="relative group">
            
            {/* Left Button */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg border border-[#E6D5B8] transition opacity-0 group-hover:opacity-100 transform -translate-x-14 group-hover:translate-x-0 transition-transform duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} className="text-[#4A403A]" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
              style={{
                scrollBehavior: 'smooth',
                msOverflowStyle: 'none', // IE dan Edge
                scrollbarWidth: 'none', // Firefox
              }}
            >
              {isLoading ? (
                // Skeleton Loading
                <div className="flex gap-6 min-w-full">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div 
                      key={i} 
                      className="flex-shrink-0 w-80 h-96 bg-gray-200 rounded-2xl animate-pulse border border-[#E6D5B8]" 
                    />
                  ))}
                </div>
              ) : products.length > 0 ? (
                // Card Produk
                products.map((product) => (
                  <div
                    key={product.id}
                    onMouseEnter={() => setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                    className="flex-shrink-0 w-80 group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 border border-[#E6D5B8] transform hover:-translate-y-2"
                  >

                    {/* Card Image */}
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img
                        src={product.gambar || 'https://via.placeholder.com/400'}
                        alt={product.nama}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                        loading="lazy"
                      />

                      {/* Overlay dengan Link */}
                      <div
                        className={`absolute inset-0 bg-black/30 transition duration-300 flex items-center justify-center
                          ${hoveredProductId === product.id ? 'opacity-100' : 'opacity-0'}`}
                      >

                        <Link
                          href={`/katalog/${product.id}`}
                          className="bg-white text-[#4A403A] px-6 py-3 rounded-full font-bold hover:bg-[#C87941] hover:text-white transition transform hover:scale-105"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="text-xs font-bold uppercase tracking-wider mb-2 text-[#C87941]">
                        {product.kategori?.nama || 'Umum'}
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-[#4A403A] line-clamp-2">
                        {product.nama}
                      </h3>
                      <p className="font-bold text-xl text-[#C87941]">
                        Rp {product.harga.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // Pesan Kosong
                <div className="flex-shrink-0 w-full text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                  <p className="text-lg">Belum ada produk yang ditambahkan.</p>
                </div>
              )}
            </div>

            {/* Right Button */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg border border-[#E6D5B8] transition opacity-0 group-hover:opacity-100 transform translate-x-14 group-hover:translate-x-0 transition-transform duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} className="text-[#4A403A]" />
            </button>

          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. TESTIMONI (DINAMIS DARI DB) */}
      <section className="py-24 px-4 bg-[#F8F7F2]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-serif font-bold mb-12 text-[#4A403A]">Kata Mereka Tentang Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-3 text-center py-20 text-gray-400 animate-pulse">Memuat testimoni...</div>
            ) : testimonials.length > 0 ? (
              testimonials.map((testi, i) => (
              <ScrollReveal key={testi.id} delay={i * 0.2}>
                <blockquote 
                  className="bg-white p-8 rounded-2xl shadow-sm border border-[#E6D5B8] relative hover:-translate-y-2 transition duration-300 h-full flex flex-col justify-between"
                >
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={16} 
                        className={idx < testi.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-gray-600 italic mb-6 flex-grow">"{testi.text}"</p>

                  {/* Author */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="font-bold text-[#4A403A]">{testi.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(testi.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </blockquote>
              </ScrollReveal>
            ))

            ) : (
              <div className="col-span-3 text-center text-gray-400 italic py-20">
                Belum ada ulasan yang ditampilkan.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION (STATIS) */}
      <ScrollReveal>
        <section className="py-24 px-4 bg-[#E6D5B8]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-serif font-bold mb-12 text-[#4A403A]">
              Pertanyaan Umum
            </h2>

            <div className="space-y-4">
              {[
                { 
                  q: "Apakah produk ini tahan lama?", 
                  a: "Sangat tahan lama. Kami menggunakan bahan PVC tebal yang anti pecah, anti rayap, dan tahan air." 
                },
                { 
                  q: "Bagaimana cara membersihkannya?", 
                  a: "Cukup dilap dengan kain lembab. Jangan menggunakan cairan kimia keras agar lapisan pernis tetap awet." 
                },
                { 
                  q: "Apakah bisa kirim ke luar kota?", 
                  a: "Ya, kami melayani pengiriman ke seluruh Indonesia dengan packing kayu aman." 
                },
                { 
                  q: "Berapa lama proses pembuatan custom?", 
                  a: "Tergantung kerumitan, biasanya memakan waktu 3-7 hari kerja." 
                },
              ].map((item, i) => (
                <details 
                  key={i} 
                  className="group bg-white rounded-xl border border-[#D4C4B0] hover:border-[#C87941] transition cursor-pointer shadow-sm overflow-hidden"
                >
                  <summary className="p-5 font-bold text-[#4A403A] flex items-center justify-between hover:bg-gray-50 transition">
                    {item.q}
                    <span className="text-[#C87941] group-open:rotate-180 transition duration-300">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 border-t border-gray-100 bg-gray-50">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}