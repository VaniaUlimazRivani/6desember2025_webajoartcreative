'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, TrendingUp, Package, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: { nama: string };
}

interface LaporanData {
  totalProduk: number;
  totalAset: number;
  totalStok: number;
  stokMenipis: Product[];
  asetPerKategori: Record<string, number>;
  allProducts: Product[];
}

export default function LaporanPage() {
  const [data, setData] = useState<LaporanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- AMBIL DATA DARI API ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/laporan/ringkasan');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Gagal ambil laporan", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- FUNGSI CETAK ---
  const handlePrint = () => {
    window.print();
  };

  // Tambahan CSS khusus untuk mencetak: buat tabel lebih formal dan tegas
  const PrintStyles = () => (
    <style>{`@media print {
        body { -webkit-print-color-adjust: exact; color-adjust: exact; }
        .print-table, .print-table th, .print-table td { border: 1px solid #000 !important; }
        .print-table { border-collapse: collapse !important; width: 100% !important; }
        .print-hidden { display: none !important; }
        .print-page-break { page-break-after: always; }
        .no-print-radius { border-radius: 0 !important; }
        table { font-size: 12pt; }
      }`}</style>
  );

  if (isLoading) return <div className="p-10 text-center text-gray-500">Menghitung aset...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">Gagal memuat laporan.</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans p-8 animate-fade-in print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER (Disembunyikan saat print) */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 rounded-full bg-white border border-[#E6D5B8] text-gray-500 hover:text-[#C87941] transition">
               <ArrowLeft size={20} />
            </Link>
            <div>
               <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Laporan Inventaris</h1>
               <p className="text-gray-500">Ringkasan nilai aset produk saat ini.</p>
            </div>
          </div>
          <button 
            onClick={handlePrint} 
            className="bg-[#4A403A] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#2d2723] transition shadow-lg"
          >
            <Printer size={20} /> Cetak Laporan
          </button>
        </div>

        {/* HEADER KHUSUS PRINT (Hanya muncul saat diprint) */}
        <div className="hidden print:block mb-8 text-center border-b pb-4 border-black">
            <h1 className="text-2xl font-bold uppercase">Laporan Aset Stok Barang</h1>
            <p className="text-sm">Ajo Art Creative - Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
        </div>

        {/* 1. KARTU STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3 print:gap-4">
          
          {/* Total Aset */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8] shadow-sm print:border-black print:shadow-none">
            <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-green-100 text-green-700 rounded-xl print:hidden">
                    <TrendingUp size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase">Valuasi Aset</span>
            </div>
            <p className="text-3xl font-bold text-[#4A403A]">
                Rp {(data.totalAset / 1000000).toFixed(1)} Jt
            </p>
            <p className="text-xs text-gray-500 mt-1">Total nilai (Harga x Stok)</p>
          </div>

          {/* Total Produk */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8] shadow-sm print:border-black print:shadow-none">
            <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl print:hidden">
                    <Package size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase">Total Fisik</span>
            </div>
            <p className="text-3xl font-bold text-[#4A403A]">
                {data.totalStok} <span className="text-sm font-normal text-gray-500">Unit</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Dari {data.totalProduk} jenis produk</p>
          </div>

          {/* Peringatan Stok */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8] shadow-sm print:border-black print:shadow-none">
            <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-red-100 text-red-700 rounded-xl print:hidden">
                    <AlertTriangle size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase">Perlu Restock</span>
            </div>
            <p className="text-3xl font-bold text-[#4A403A]">
                {data.stokMenipis.length} <span className="text-sm font-normal text-gray-500">Item</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Stok kurang dari 5 unit</p>
          </div>
        </div>

        {/* 2. TABEL PERINGATAN STOK MENIPIS (Jika ada) */}
        {data.stokMenipis.length > 0 && (
            <div className="mb-8 p-6 bg-red-50 rounded-2xl border border-red-100 print:bg-white print:border-black">
                <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                    <AlertTriangle size={18}/> Barang Stok Menipis (Segera Produksi)
                </h3>
                <table className="w-full text-sm text-left print-table">
                    <thead className="text-gray-500 border-b border-red-200">
                        <tr>
                            <th className="pb-2">Nama Produk</th>
                            <th className="pb-2">Sisa Stok</th>
                            <th className="pb-2 text-right">Potensi Rugi (Omset)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-red-100">
                        {data.stokMenipis.map(p => (
                            <tr key={p.id}>
                                <td className="py-2 font-medium text-[#4A403A]">{p.nama}</td>
                                <td className="py-2 font-bold text-red-600">{p.stok} unit</td>
                                <td className="py-2 text-right text-gray-600">Rp {p.harga.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* 3. TABEL DETAIL SEMUA ASET */}
        <div className="bg-white rounded-3xl border border-[#E6D5B8] overflow-hidden print:border-black print:rounded-none">
            <div className="p-6 bg-[#FAF8F1] border-b border-[#E6D5B8] print:bg-white print:border-black">
                <h3 className="font-bold text-[#4A403A] flex items-center gap-2">
                    <FileText size={20} /> Rincian Nilai Aset per Produk
                </h3>
            </div>
            <table className="w-full text-left text-sm print-table">
                <thead className="bg-gray-50 text-gray-600 font-bold uppercase border-b border-gray-200">
                    <tr>
                        <th className="p-4">Produk</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4 text-right">Harga Satuan</th>
                        <th className="p-4 text-center">Stok</th>
                        <th className="p-4 text-right">Total Aset (Rp)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.allProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 print:hover:bg-white">
                            <td className="p-4 font-medium text-[#4A403A]">{p.nama}</td>
                            <td className="p-4 text-gray-500">{p.kategori?.nama}</td>
                            <td className="p-4 text-right">Rp {p.harga.toLocaleString('id-ID')}</td>
                            <td className="p-4 text-center">{p.stok}</td>
                            <td className="p-4 text-right font-bold text-[#4A403A]">
                                Rp {(p.harga * p.stok).toLocaleString('id-ID')}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-[#FAF8F1] font-bold text-[#4A403A] border-t border-[#E6D5B8] print:bg-gray-100 print:border-black">
                    <tr>
                        <td colSpan={4} className="p-4 text-right uppercase">Total Nilai Inventaris</td>
                        <td className="p-4 text-right text-lg">Rp {data.totalAset.toLocaleString('id-ID')}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        {/* Footer Print */}
        <div className="hidden print:block mt-10 text-center text-xs text-gray-400">
            <p>Dokumen ini dicetak otomatis dari sistem Admin Panel Ajo Art.</p>
        </div>

        {/* Inject print styles */}
        <PrintStyles />

      </div>
    </div>
  );
}