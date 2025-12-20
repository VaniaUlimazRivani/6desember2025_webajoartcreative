'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, ArrowLeft, Eye, Loader2, ChevronUp, ChevronDown, X } from 'lucide-react';

// Interface sesuai dengan Database Prisma
interface Product {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: { nama: string };
  gambar: string;
}

type SortKey = 'nama' | 'harga' | 'stok' | 'id';
type SortDirection = 'asc' | 'desc';

export default function AdminProductListPage() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [stockRange, setStockRange] = useState<[number, number]>([0, 1000]);
  
  // Sorting & Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // UI State
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const ITEMS_PER_PAGE = 10;

  // --- 1. FETCH DATA PRODUK & KATEGORI ---
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/produk');
      const data = await res.json();
      
      if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Data API bukan array:", data);
        setProducts([]);
      }
      
      // Extract kategori unik
      const cats = data.data || data || [];
      const uniqueCats = [...new Set(cats.map((p: Product) => p.kategori?.nama).filter(Boolean))];
      setCategories(uniqueCats as string[]);
      
      setCurrentPage(1);
    } catch (error) {
      console.error('Gagal ambil data', error);
      setProducts([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. DEBOUNCE SEARCH ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- 3. FILTER & SORT LOGIC ---
  const processedProducts = useMemo(() => {
    let result = [...(products || [])];

    // Filter berdasarkan search
    if (debouncedSearch) {
      result = result.filter(p => 
        p.nama && p.nama.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Filter berdasarkan kategori
    if (selectedCategory) {
      result = result.filter(p => p.kategori?.nama === selectedCategory);
    }

    // Filter berdasarkan harga (PAKSA NUMBER)
    result = result.filter(p => {
      const harga = Number(p.harga);
      return harga >= priceRange[0] && harga <= priceRange[1];
    });

    // Filter berdasarkan stok (PAKSA NUMBER)
    result = result.filter(p => {
      const stok = Number(p.stok);
      return stok >= stockRange[0] && stok <= stockRange[1];
    });
   
    // Sort
    result.sort((a, b) => {
      let aVal: any = Number(a[sortKey]);
      let bVal: any = Number(b[sortKey]);

      if (sortKey === 'nama') {
        aVal = a.nama?.toLowerCase() || '';
        bVal = b.nama?.toLowerCase() || '';
      }

      if (sortKey === 'nama') {
        aVal = a.nama?.toLowerCase() || '';
        bVal = b.nama?.toLowerCase() || '';
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, debouncedSearch, selectedCategory, priceRange, stockRange, sortKey, sortDirection]);

  // --- 4. PAGINATION ---
  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    return processedProducts.slice(startIdx, endIdx);
  }, [processedProducts, currentPage]);

  // --- 5. HANDLE SORT ---
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // --- 6. RENDER SORT ICON ---
  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <div className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // --- 7. HANDLE HAPUS PRODUK ---
  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Pindahkan "${nama}" ke Sampah?`)) return;

    setLoadingIds(prev => [...prev, id]);

    try {
      const res = await fetch(`/api/produk/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        if (paginatedProducts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        alert('Gagal memindahkan produk ke sampah');
      }
    } catch (error) {
      console.error('Error delete:', error);
      alert('Terjadi kesalahan sistem');
    } finally {
      setLoadingIds(prev => prev.filter(x => x !== id));
    }
  };

  // --- 8. CLEAR ALL FILTERS ---
  const clearAllFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('');
    setPriceRange([0, 10000000]);
    setStockRange([0, 1000]);
    setCurrentPage(1);
  };

  const hasActiveFilters = debouncedSearch || selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000000 || stockRange[0] > 0 || stockRange[1] < 1000;

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* ===== HEADER & BREADCRUMB ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 rounded-full bg-white border border-[#E6D5B8] text-gray-500 hover:text-[#C87941] transition">
                <ArrowLeft size={20} />
            </Link>
            <div>
                <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Daftar Produk</h1>
                <p className="text-gray-500">Kelola katalog produk kerajinan Ajo Art. Total: <span className="font-bold">{processedProducts.length}</span> produk</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <Link 
              href="/admin/produk/sampah"
              className="bg-white border border-[#E6D5B8] hover:bg-gray-50 text-[#4A403A] px-4 py-3 rounded-xl font-bold transition"
            >
              🗑️ Sampah
            </Link>
            <Link 
              href="/admin/produk/tambah"
              className="bg-[#C87941] hover:bg-[#b06a38] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg transform hover:-translate-y-1"
            >
              <Plus size={20} /> Tambah
            </Link>
          </div>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E6D5B8] flex items-center gap-3">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama produk..." 
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* ===== FILTER & SORT CONTROLS ===== */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Info & Filter Toggle */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {debouncedSearch ? (
                <>🔍 Hasil: <strong>{processedProducts.length}</strong></>
              ) : (
                <>📊 Total: <strong>{processedProducts.length}</strong></>
              )}
            </div>
            
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                showFilterPanel
                  ? 'bg-[#C87941] text-white'
                  : 'bg-white border border-[#E6D5B8] hover:bg-gray-50'
              }`}
            >
              ⚙️ Filter & Sort
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 font-medium hover:bg-red-100 transition"
              >
                ✕ Bersihkan
              </button>
            )}
          </div>
        </div>

        {/* ===== FILTER PANEL (COLLAPSIBLE) ===== */}
        {showFilterPanel && (
          <div className="mb-8 bg-white rounded-3xl shadow-sm border border-[#E6D5B8] p-6 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              
              {/* Filter: Nama (Abjad A-Z / Z-A) */}
              <div>
                <label className="block text-sm font-bold text-[#4A403A] mb-3">📝 Urutkan Nama</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSortKey('nama');
                      setSortDirection('asc');
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                      sortKey === 'nama' && sortDirection === 'asc'
                        ? 'bg-[#C87941] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    A → Z
                  </button>
                  <button
                    onClick={() => {
                      setSortKey('nama');
                      setSortDirection('desc');
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                      sortKey === 'nama' && sortDirection === 'desc'
                        ? 'bg-[#C87941] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Z → A
                  </button>
                </div>
              </div>

              {/* Filter: Kategori */}
              <div>
                <label className="block text-sm font-bold text-[#4A403A] mb-3">🏷️ Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2 rounded-lg border border-[#E6D5B8] bg-white text-gray-700"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Filter: Harga Min-Max (FIXED: Min & Max Kosong Awalnya) */}
              <div>
                <label className="block text-sm font-bold text-[#4A403A] mb-3">💰 Harga</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    // LOGIKA: Jika 0, tampilkan kosong
                    value={priceRange[0] === 0 ? '' : priceRange[0]}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPriceRange([val === '' ? 0 : Number(val), priceRange[1]]);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 rounded-lg border border-[#E6D5B8] text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    // LOGIKA BARU: Jika nilainya masih default (10.000.000), tampilkan kosong
                    value={priceRange[1] === 10000000 ? '' : priceRange[1]}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Jika user hapus (kosong), kembalikan ke 10.000.000
                      setPriceRange([priceRange[0], val === '' ? 10000000 : Number(val)]);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 rounded-lg border border-[#E6D5B8] text-sm"
                  />
                </div>
              </div>

              {/* Filter: Stok Min-Max (FIXED: Min & Max Kosong Awalnya) */}
              <div>
                <label className="block text-sm font-bold text-[#4A403A] mb-3">📦 Stok</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    // LOGIKA: Jika 0, tampilkan kosong
                    value={stockRange[0] === 0 ? '' : stockRange[0]}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStockRange([val === '' ? 0 : Number(val), stockRange[1]]);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 rounded-lg border border-[#E6D5B8] text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    // LOGIKA BARU: Jika nilainya masih default (1.000), tampilkan kosong
                    value={stockRange[1] === 1000 ? '' : stockRange[1]}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Jika user hapus (kosong), kembalikan ke 1.000
                      setStockRange([stockRange[0], val === '' ? 1000 : Number(val)]);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 rounded-lg border border-[#E6D5B8] text-sm"
                  />
                </div>
              </div>

              {/* Filter: Sort Harga & Stok (LABEL BARU) */}
              <div>
                <label className="block text-sm font-bold text-[#4A403A] mb-3">🔢 Sortir Lain</label>
                <div className="space-y-2">
                  {/* Harga Terendah (ASC) */}
                  <button
                    onClick={() => {
                      setSortKey('harga');
                      setSortDirection('asc');
                      setCurrentPage(1);
                    }}
                    className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition ${
                      sortKey === 'harga' && sortDirection === 'asc'
                        ? 'bg-[#C87941] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Harga Terendah
                  </button>

                  {/* Harga Tertinggi (DESC) */}
                  <button
                    onClick={() => {
                      setSortKey('harga');
                      setSortDirection('desc');
                      setCurrentPage(1);
                    }}
                    className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition ${
                      sortKey === 'harga' && sortDirection === 'desc'
                        ? 'bg-[#C87941] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Harga Tertinggi
                  </button>

                  {/* Stok Terendah (ASC) */}
                  <button
                    onClick={() => {
                      setSortKey('stok');
                      setSortDirection('asc');
                      setCurrentPage(1);
                    }}
                    className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition ${
                      sortKey === 'stok' && sortDirection === 'asc'
                        ? 'bg-[#C87941] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Stok Terendah
                  </button>

                  {/* Stok Tertinggi (DESC) */}
                  <button
                    onClick={() => {
                      setSortKey('stok');
                      setSortDirection('desc');
                      setCurrentPage(1);
                    }}
                    className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition ${
                      sortKey === 'stok' && sortDirection === 'desc'
                        ? 'bg-[#C87941] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Stok Tertinggi
                  </button>
                </div>
              </div>

            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-6 pt-6 border-t border-[#E6D5B8]">
                <h4 className="text-sm font-bold text-[#4A403A] mb-3">Filter Aktif:</h4>
                <div className="flex flex-wrap gap-2">
                  {debouncedSearch && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      🔍 Cari: "{debouncedSearch}"
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      🏷️ {selectedCategory}
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 10000000) && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      💰 Rp {priceRange[0].toLocaleString('id-ID')} - {priceRange[1].toLocaleString('id-ID')}
                    </span>
                  )}
                  {(stockRange[0] > 0 || stockRange[1] < 1000) && (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      📦 {stockRange[0]} - {stockRange[1]} unit
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== TABEL PRODUK ===== */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E6D5B8] overflow-hidden">
          {isLoading ? (
             <div className="p-10 text-center text-gray-500 animate-pulse">
               <Loader2 className="inline animate-spin mr-2" />
               Memuat data produk...
             </div>
          ) : processedProducts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-lg font-bold text-[#4A403A] mb-2">Tidak ada produk</h3>
              <p className="text-gray-500 mb-6">
                {hasActiveFilters
                  ? 'Tidak ada produk yang sesuai dengan filter Anda.'
                  : 'Belum ada produk. Mulai dengan menambah produk baru!'}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                {hasActiveFilters && (
                  <button 
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-white border border-[#E6D5B8] rounded-xl hover:bg-gray-50"
                  >
                    ✕ Bersihkan Filter
                  </button>
                )}
                <Link href="/admin/produk/tambah" className="px-6 py-3 bg-[#C87941] text-white rounded-xl hover:bg-[#b06a38]">
                  + Tambah Produk
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F1] border-b border-[#E6D5B8] text-[#4A403A]">
                    <th className="p-6 font-bold text-sm uppercase tracking-wider">Produk</th>
                    <th className="p-6 font-bold text-sm uppercase tracking-wider">Kategori</th>
                    
                    <th className="p-6 font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-white/50 transition" onClick={() => handleSort('harga')}>
                      <div className="flex items-center justify-between">
                        <span>Harga</span>
                        {renderSortIcon('harga')}
                      </div>
                    </th>
                    
                    <th className="p-6 font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-white/50 transition" onClick={() => handleSort('stok')}>
                      <div className="flex items-center justify-between">
                        <span>Stok</span>
                        {renderSortIcon('stok')}
                      </div>
                    </th>
                    
                    <th className="p-6 font-bold text-sm uppercase tracking-wider">Status</th>
                    <th className="p-6 font-bold text-sm uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((item) => {
                    const isProcessing = loadingIds.includes(item.id);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                <img 
                                  src={item.gambar || 'https://via.placeholder.com/100?text=No+Img'} 
                                  alt={item.nama} 
                                  className="w-full h-full object-cover" 
                                />
                            </div>
                            <span className="font-bold text-[#4A403A] line-clamp-2">{item.nama}</span>
                          </div>
                        </td>
                        
                        <td className="p-6">
                           <span className="bg-[#E6D5B8]/30 text-[#C87941] px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap">
                             {item.kategori?.nama || 'Umum'}
                           </span>
                        </td>
                        
                        <td className="p-6 text-gray-600 font-medium whitespace-nowrap">
                           Rp {item.harga.toLocaleString('id-ID')}
                        </td>
                        
                        <td className="p-6 text-gray-600 font-bold">
                           <span className={`
                             px-3 py-1 rounded-lg text-sm font-bold
                             ${item.stok === 0 ? 'bg-red-100 text-red-700' : 
                               item.stok < 5 ? 'bg-yellow-100 text-yellow-700' : 
                               'bg-blue-100 text-blue-700'}
                           `}>
                             {item.stok} unit
                           </span>
                        </td>

                        <td className="p-6">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                             item.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                           }`}>
                              {item.stok > 0 ? '✓ Aktif' : '✕ Habis'}
                           </span>
                        </td>
                        
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-2">
                             <Link 
                               href={`/katalog/${item.id}`} 
                               target="_blank" 
                               className="p-2 text-gray-400 hover:text-[#4A403A] hover:bg-gray-100 rounded-lg transition" 
                               title="Lihat di Web"
                             >
                                <Eye size={18} />
                             </Link>

                             <Link 
                               href={`/admin/edit-produk/${item.id}`} 
                               className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition" 
                               title="Edit"
                             >
                                <Edit size={18} />
                             </Link>

                             <button 
                                onClick={() => handleDelete(item.id, item.nama)}
                                disabled={isProcessing}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" 
                                title="Pindah ke Sampah"
                             >
                                {isProcessing ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                             </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== PAGINATION ===== */}
        {processedProducts.length > 0 && (
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Info Pagination */}
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-bold">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> - <span className="font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, processedProducts.length)}</span> dari <span className="font-bold">{processedProducts.length}</span> produk
            </div>

            {/* Pagination Controls */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-[#E6D5B8] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                ← Sebelumnya
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-bold transition ${
                      currentPage === page
                        ? 'bg-[#C87941] text-white'
                        : 'bg-white border border-[#E6D5B8] hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-[#E6D5B8] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                Berikutnya →
              </button>
            </div>

            <div className="text-sm text-gray-500">
              {ITEMS_PER_PAGE} produk per halaman
            </div>
          </div>
        )}
      </div>
    </div>
  );
}