'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ArrowRight, Star, X, Loader2 } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';

interface Product {
  id: number;
  nama: string;
  harga: number;
  gambar: string | null;
  kategori: {
    nama: string;
  };
  rating?: number;
}

const ITEMS_PER_PAGE = 12; // Jumlah item per halaman

export default function Katalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Semua']);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Virtual Scrolling
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    async function fetchData() {
      try {
        const [resProduk, resKategori] = await Promise.all([
          fetch('/api/produk'),
          fetch('/api/kategori')
        ]);

        const dataProduk = await resProduk.json();
        const dataKategori = await resKategori.json();

        setProducts(dataProduk);

        if (Array.isArray(dataKategori)) {
          const namaKategori = dataKategori.map((k: any) => k.nama);
          setCategories(['Semua', ...namaKategori]);
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- 2. LOGIC FILTER ---
  const filteredProducts = products.filter(p => {
    const categoryName = p.kategori?.nama || 'Uncategorized';
    const matchCategory = filter === 'Semua' || categoryName === filter;
    const productName = p.nama ? p.nama.toLowerCase() : '';
    const matchSearch = productName.includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // --- 3. INFINITE SCROLL / VIRTUAL SCROLL LOGIC ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayedCount < filteredProducts.length) {
          // Load lebih banyak item saat user scroll ke bawah
          setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayedCount, filteredProducts.length]);

  // Reset displayed count ketika filter berubah
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [filter, search]);

  // Produk yang akan ditampilkan
  const visibleProducts = filteredProducts.slice(0, displayedCount);

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans">
      <Navbar />
      
      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
        
        {/* Header Katalog */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-[#4A403A]">Katalog Produk</h1>
          <p className="text-lg text-gray-500">Jelajahi koleksi kerajinan tangan unik Ajo Art</p>
        </div>

        {/* Search Bar & Mobile Filter Button */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#E6D5B8] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C87941] bg-white text-[#4A403A] font-medium placeholder-gray-400 transition"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-5 top-4 text-gray-400" size={24} />
          </div>
          
          {/* Tombol Filter Mobile */}
          <button 
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden bg-[#4A403A] text-white p-4 rounded-2xl shadow-sm hover:bg-[#362f2b] transition"
          >
            <Filter size={24} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR FILTER (Desktop) --- */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="p-6 rounded-2xl bg-white border border-[#E6D5B8] shadow-sm">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-lg border-b pb-4 text-[#4A403A]">
                  <Filter size={20} /> Kategori Produk
                </h3>
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat}>
                      <button 
                        onClick={() => setFilter(cat)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition font-medium flex justify-between items-center ${filter === cat ? 'bg-[#4A403A] text-white shadow-md' : 'hover:bg-[#E6D5B8] text-gray-600'}`}
                      >
                        {cat}
                        {filter === cat && <span className="w-2 h-2 rounded-full bg-[#C87941]"></span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* --- SIDEBAR FILTER (Mobile Overlay) --- */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex justify-end lg:hidden animate-fade-in">
              <div className="w-3/4 bg-white h-full p-6 overflow-y-auto animate-slide-in-right shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-lg text-[#4A403A]">Filter Kategori</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                    <X size={24} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat}>
                      <button 
                        onClick={() => { setFilter(cat); setMobileFilterOpen(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${filter === cat ? 'bg-[#4A403A] text-white shadow' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* --- MAIN CONTENT - MASONRY GRID --- */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <Loader2 className="animate-spin text-[#C87941] mx-auto mb-4" size={40} />
                <p className="text-gray-500 text-lg">Sedang memuat produk...</p>
              </div>
            ) : (
              <>
                {visibleProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleProducts.map(product => (
                      <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-[#E6D5B8] group relative">
                        
                        <Link href={`/katalog/${product.id}`} className="block">
                          <div className="aspect-square overflow-hidden bg-gray-100 relative cursor-pointer">
                            <Image
                              src={product.gambar || 'https://via.placeholder.com/300?text=No+Image'} 
                              alt={product.nama} 
                              fill
                              className="object-cover group-hover:scale-105 transition duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-end">
                              <span className="text-white text-sm font-bold flex items-center gap-1">Lihat Detail <ArrowRight size={16}/></span>
                            </div>
                          </div>
                        </Link>
                        
                        <div className="p-5">
                          <div className="text-xs font-bold uppercase tracking-wider mb-2 text-[#C87941]">
                            {product.kategori?.nama || 'Umum'}
                          </div>
                          
                          <Link href={`/katalog/${product.id}`}>
                            <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-[#C87941] transition cursor-pointer text-[#4A403A]">
                              {product.nama}
                            </h3>
                          </Link>
                          
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-xl text-[#4A403A]">
                              Rp {product.harga.toLocaleString('id-ID')}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Star size={12} fill="#fbbf24" stroke="none" /> {product.rating || 5.0}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-xl text-gray-500 font-medium">Produk tidak ditemukan.</p>
                  </div>
                )}

                {/* Observer Target - untuk infinite scroll */}
                <div ref={observerTarget} className="mt-8 flex justify-center">
                  {displayedCount < filteredProducts.length && (
                    <div className="text-gray-400 text-sm">
                      Menampilkan {visibleProducts.length} dari {filteredProducts.length} produk. Scroll ke bawah untuk lebih banyak...
                    </div>
                  )}
                </div>

                {/* Loading indicator saat load lebih banyak */}
                {displayedCount < filteredProducts.length && (
                  <div className="mt-8 flex justify-center">
                    <Loader2 className="animate-spin text-[#C87941]" size={32} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}