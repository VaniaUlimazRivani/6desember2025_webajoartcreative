'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, ChevronDown, Star } from 'lucide-react';
import { productsData } from '@/lib/data';
import Navbar from '@/components/Navbar';

export default function Katalog() {
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['Semua', 'Lampu Hias', 'Jam Dinding', 'Desain Interior', 'Tas', 'Bangku & Sofa'];

  const filteredProducts = productsData.filter(p => {
    const matchCategory = filter === 'Semua' || p.category === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans">
      <Navbar />
      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-[#4A403A]">Katalog Produk</h1>
          <p className="text-lg text-gray-500">Jelajahi koleksi kerajinan tangan unik Ajo Art</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
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

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="relative mb-8">
              <input 
                type="text" 
                placeholder="Cari produk..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#E6D5B8] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C87941] bg-white transition"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-5 top-4.5 text-gray-400" size={24} />
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-[#E6D5B8] group relative"
                  >
                    <Link href={`/produk/${product.id}`} className="block">
                      <div className="aspect-square overflow-hidden bg-gray-100 relative cursor-pointer">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-end">
                          <span className="text-white text-sm font-bold flex items-center gap-1">Lihat Detail <ArrowRight size={16}/></span>
                        </div>
                      </div>
                    </Link>
                    <div className="p-5">
                      <div className="text-xs font-bold uppercase tracking-wider mb-2 text-[#C87941]">{product.category}</div>
                      <Link href={`/produk/${product.id}`}>
                        <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-[#C87941] transition cursor-pointer text-[#4A403A]">{product.name}</h3>
                      </Link>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-xl text-[#4A403A]">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                           <Star size={12} fill="#fbbf24" stroke="none" /> {product.rating}
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
          </div>
        </div>
      </div>
    </div>
  );
}
