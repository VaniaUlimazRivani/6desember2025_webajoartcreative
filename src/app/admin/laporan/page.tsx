'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, Download, TrendingUp, Package, AlertTriangle, FileText, PlusCircle, X, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

// --- TIPE DATA ---
interface Product {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: { nama: string };
}

interface Sale {
  id: number;
  tanggal: string;
  namaProduk: string;
  kategori: string;
  jumlah: number;
  hargaSatuan: number;
  total: number;
}

interface LaporanData {
  totalAset: number;
  totalStok: number;
  stokMenipis: Product[];
  allProducts: Product[];
}

export default function LaporanPage() {
  // State Utama
  const [reportData, setReportData] = useState<LaporanData | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // Untuk dropdown form
  const [isLoading, setIsLoading] = useState(true);
  
  // State Filter
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // State Modal Input Penjualan
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ produkId: '', jumlah: 1, tanggal: new Date().toISOString().split('T')[0] });

  // Ref untuk PDF
  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- 1. FETCH DATA AWAL ---
  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      // Ambil Ringkasan Aset
      const resReport = await fetch('/api/laporan/ringkasan');
      const jsonReport = await resReport.json();
      setReportData(jsonReport);
      
      // Ambil List Produk (Untuk Dropdown Form)
      setProducts(jsonReport.allProducts || []);

      // Ambil Data Penjualan (Dengan Filter)
      let urlSales = '/api/penjualan';
      if (startDate && endDate) urlSales += `?start=${startDate}&end=${endDate}`;
      
      const resSales = await fetch(urlSales);
      const jsonSales = await resSales.json();
      setSales(jsonSales);

    } catch (error) {
      console.error("Gagal load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. SUBMIT PENJUALAN MANUAL ---
  const handleSimpanPenjualan = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.produkId) return alert("Pilih produk dulu!");
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/penjualan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("✅ Penjualan berhasil dicatat & stok berkurang!");
        setShowModal(false);
        setForm({ produkId: '', jumlah: 1, tanggal: new Date().toISOString().split('T')[0] });
        fetchData(); // Refresh data
      } else {
        const msg = await res.json();
        alert("Gagal: " + msg.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. DOWNLOAD PDF (Langsung File Explorer) ---
const handleDownloadPDF = async () => {
  if (!pdfTemplateRef.current) return;
  setIsDownloading(true);

  try {
    const html2pdf: any = (await import('html2pdf.js')).default;

    const opt: any = {
      margin: [10, 10, 10, 10],
      filename: `Laporan_AjoArt_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    pdfTemplateRef.current.style.display = 'block';
    await html2pdf().set(opt).from(pdfTemplateRef.current).save();
    pdfTemplateRef.current.style.display = 'none';
  } catch (error) {
    console.error(error);
    alert("Gagal download PDF.");
  } finally {
    setIsDownloading(false);
  }
};

  // Hitung Total Pendapatan dari Sales yang tampil
  const totalPendapatanSales = sales.reduce((acc, curr) => acc + curr.total, 0);

  if (isLoading) return <div className="p-10 text-center">Memuat data...</div>;
  if (!reportData) return <div className="p-10 text-center text-red-500">Error memuat data.</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 rounded-full bg-white border border-[#E6D5B8] text-gray-500 hover:text-[#C87941] transition">
               <ArrowLeft size={20} />
            </Link>
            <div>
               <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Laporan & Penjualan</h1>
               <p className="text-gray-500">Rekap aset inventaris dan catat penjualan manual.</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => setShowModal(true)}
               className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
             >
               <PlusCircle size={20} /> Catat Penjualan
             </button>
             <button 
               onClick={handleDownloadPDF} 
               disabled={isDownloading}
               className="bg-[#4A403A] text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#2d2723] transition shadow-lg disabled:opacity-50"
             >
               {isDownloading ? <Loader2 className="animate-spin" size={20}/> : <Download size={20} />} 
               Download PDF
             </button>
          </div>
        </div>

        {/* --- BAGIAN 1: STATISTIK RINGKAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8] shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl"><Package size={20}/></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Total Aset (Stok)</span>
             </div>
             <p className="text-3xl font-bold text-[#4A403A]">Rp {(reportData.totalAset / 1000000).toFixed(1)} Jt</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8] shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-green-100 text-green-700 rounded-xl"><TrendingUp size={20}/></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Pendapatan Penjualan</span>
             </div>
             <p className="text-3xl font-bold text-[#4A403A]">Rp {totalPendapatanSales.toLocaleString('id-ID')}</p>
             <p className="text-xs text-gray-400 mt-1">*Sesuai filter tanggal</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8] shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-red-100 text-red-700 rounded-xl"><AlertTriangle size={20}/></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Perlu Restock</span>
             </div>
             <p className="text-3xl font-bold text-[#4A403A]">{reportData.stokMenipis.length} Item</p>
           </div>
        </div>

        {/* --- BAGIAN 2: TABEL PENJUALAN --- */}
        <div className="bg-white rounded-2xl border border-[#E6D5B8] overflow-hidden shadow-sm mb-8">
            <div className="p-6 border-b border-[#E6D5B8] bg-[#FAF8F1] flex flex-col md:flex-row justify-between items-center gap-4">
               <h3 className="font-bold text-[#4A403A] text-lg flex items-center gap-2">
                  <FileText size={20} /> Riwayat Penjualan
               </h3>
               {/* Filter Tanggal */}
               <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-sm p-1 outline-none" />
                  <span className="text-gray-400">-</span>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-sm p-1 outline-none" />
               </div>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase border-b border-gray-200">
                     <tr>
                        <th className="p-4">Tanggal</th>
                        <th className="p-4">Produk</th>
                        <th className="p-4 text-center">Jumlah</th>
                        <th className="p-4 text-right">Total (Rp)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {sales.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-gray-400">Belum ada data penjualan pada periode ini.</td></tr>
                     ) : (
                        sales.map(s => (
                           <tr key={s.id} className="hover:bg-gray-50">
                              <td className="p-4 text-gray-500">{new Date(s.tanggal).toLocaleDateString('id-ID')}</td>
                              <td className="p-4 font-bold text-[#4A403A]">
                                 {s.namaProduk} <br/> 
                                 <span className="text-xs font-normal text-gray-400">{s.kategori}</span>
                              </td>
                              <td className="p-4 text-center font-bold">{s.jumlah}</td>
                              <td className="p-4 text-right text-green-600 font-bold">
                                 {s.total.toLocaleString('id-ID')}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
        </div>

      </div>

      {/* --- MODAL INPUT PENJUALAN --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAF8F1]">
                 <h3 className="font-bold text-lg text-[#4A403A]">Catat Penjualan</h3>
                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
              </div>
              <form onSubmit={handleSimpanPenjualan} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Transaksi</label>
                    <input 
                      type="date" 
                      required
                      value={form.tanggal}
                      onChange={e => setForm({...form, tanggal: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Produk</label>
                    <select 
                      required
                      value={form.produkId}
                      onChange={e => setForm({...form, produkId: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none bg-white"
                    >
                       <option value="">-- Pilih Produk --</option>
                       {products.map(p => (
                          <option key={p.id} value={p.id}>{p.nama} (Stok: {p.stok})</option>
                       ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Terjual</label>
                    <input 
                      type="number" 
                      min="1"
                      required
                      value={form.jumlah}
                      onChange={e => setForm({...form, jumlah: Number(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#C87941] outline-none"
                    />
                 </div>
                 
                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="w-full bg-[#C87941] text-white py-3 rounded-xl font-bold hover:bg-[#a86535] transition flex justify-center items-center gap-2 disabled:opacity-50"
                 >
                    {isSubmitting ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
                    Simpan & Potong Stok
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* --- TEMPLATE PDF (HIDDEN) --- */}
      <div style={{ display: 'none' }}>
         <div ref={pdfTemplateRef} style={{ width: '210mm', minHeight: '297mm', padding: '20mm', backgroundColor: '#fff', color: '#000', fontFamily: 'Times New Roman' }}>
            
            {/* Kop Surat */}
            <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: '10px', marginBottom: '20px' }}>
               <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>AJO ART CREATIVE</h1>
               <p style={{ margin: 0, fontSize: '12px' }}>Laporan Penjualan & Inventaris Stok</p>
               <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic' }}>Periode Cetak: {new Date().toLocaleDateString('id-ID')}</p>
            </div>

            {/* Bagian 1: Ringkasan */}
            <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>I. Ringkasan Aset</h3>
            <ul style={{ fontSize: '12px', lineHeight: '1.5' }}>
               <li><strong>Total Nilai Aset Gudang:</strong> Rp {reportData.totalAset.toLocaleString('id-ID')}</li>
               <li><strong>Total Unit Barang:</strong> {reportData.totalStok} Unit</li>
               <li><strong>Total Pendapatan (Periode Ini):</strong> Rp {totalPendapatanSales.toLocaleString('id-ID')}</li>
            </ul>

            {/* Bagian 2: Tabel Penjualan */}
            <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '5px', marginTop: '20px' }}>II. Rincian Penjualan Offline</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginTop: '10px' }}>
               <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                     <th style={{ border: '1px solid #000', padding: '5px' }}>Tanggal</th>
                     <th style={{ border: '1px solid #000', padding: '5px' }}>Nama Produk</th>
                     <th style={{ border: '1px solid #000', padding: '5px' }}>Qty</th>
                     <th style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>Total</th>
                  </tr>
               </thead>
               <tbody>
                  {sales.map(s => (
                     <tr key={s.id}>
                        <td style={{ border: '1px solid #000', padding: '5px' }}>{new Date(s.tanggal).toLocaleDateString('id-ID')}</td>
                        <td style={{ border: '1px solid #000', padding: '5px' }}>{s.namaProduk}</td>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{s.jumlah}</td>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{s.total.toLocaleString('id-ID')}</td>
                     </tr>
                  ))}
               </tbody>
               <tfoot>
                  <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                     <td colSpan={3} style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>TOTAL PENDAPATAN</td>
                     <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>Rp {totalPendapatanSales.toLocaleString('id-ID')}</td>
                  </tr>
               </tfoot>
            </table>

            {/* Tanda Tangan */}
            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
               <div style={{ textAlign: 'center', width: '200px' }}>
                  <p>Padang, {new Date().toLocaleDateString('id-ID')}</p>
                  <p style={{ marginTop: '60px', borderTop: '1px solid #000', paddingTop: '5px' }}>Pemilik / Admin</p>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}