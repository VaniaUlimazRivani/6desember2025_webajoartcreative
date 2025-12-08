'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, FileText, MessageSquare, TrendingUp, LucideIcon, ArrowRight } from 'lucide-react';

// --- KOMPONEN KARTU STATISTIK ---
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color, loading }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6D5B8] hover:shadow-lg transition duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3.5 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm mb-1 font-medium">{title}</h3>
    {loading ? (
        <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
    ) : (
        <p className="text-3xl font-bold text-[#4A403A]">{value}</p>
    )}
  </div>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProduk: 0,
    totalAset: 0,
    totalTestimoni: 0,
    pendingTestimoni: 0
  });

  // --- AMBIL SEMUA DATA (REAL-TIME) ---
  useEffect(() => {
    async function fetchAllStats() {
      try {
        // Kita panggil 3 API sekaligus secara paralel agar cepat
        const [resProduk, resTesti, resLaporan] = await Promise.all([
            fetch('/api/produk'),
            fetch('/api/testimoni'),
            fetch('/api/laporan/ringkasan')
        ]);

        const produkData = await resProduk.json();
        const testiData = await resTesti.json();
        const laporanData = await resLaporan.json();

        // Hitung Testimoni yang statusnya "Pending"
        const pendingCount = Array.isArray(testiData) 
            ? testiData.filter((t: any) => t.status === 'Pending').length 
            : 0;

        setStats({
            totalProduk: Array.isArray(produkData) ? produkData.length : 0,
            totalTestimoni: Array.isArray(testiData) ? testiData.length : 0,
            pendingTestimoni: pendingCount,
            totalAset: laporanData.totalAset || 0 // Ambil dari API Laporan yang baru kita buat
        });

      } catch (error) {
        console.error('Gagal mengambil statistik:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in font-sans p-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Selamat Datang, Admin!</h1>
        <p className="text-gray-500 mt-1">Berikut adalah ringkasan aktivitas toko Anda secara real-time.</p>
      </div>
      
      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KARTU 1: TOTAL ASET (Uang Mengendap) */}
        <StatCard 
            title="Valuasi Aset (Stok)" 
            value={`Rp ${(stats.totalAset / 1000000).toFixed(1)}Jt`} 
            change="Realtime" 
            icon={TrendingUp} 
            color="bg-green-500" 
            loading={loading}
        />

        {/* KARTU 2: TOTAL PRODUK */}
        <StatCard 
            title="Total Produk" 
            value={stats.totalProduk.toString()} 
            change="Item" 
            icon={Package} 
            color="bg-blue-500" 
            loading={loading}
        />

        {/* KARTU 3: KONTEN (Placeholder untuk fitur blog/artikel nanti) */}
        <StatCard 
            title="Halaman Konten" 
            value="Aktif" 
            change="Stabil" 
            icon={FileText} 
            color="bg-orange-500" 
            loading={false}
        />

        {/* KARTU 4: TESTIMONI (Penting: Menampilkan yg Pending) */}
        <StatCard 
            title="Total Ulasan" 
            value={stats.totalTestimoni.toString()} 
            change={stats.pendingTestimoni > 0 ? `+${stats.pendingTestimoni} Pending` : "Aman"} // Notifikasi jika ada pending
            icon={MessageSquare} 
            color={stats.pendingTestimoni > 0 ? "bg-red-500" : "bg-purple-500"} // Merah jika ada yang harus di-approve
            loading={loading}
        />
      </div>

      {/* Shortcut Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#E6D5B8] shadow-sm flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-lg mb-2 text-[#4A403A]">Status Sistem</h3>
            <p className="text-gray-500 mb-6">Database terhubung dan berjalan lancar.</p>
            <div className="flex gap-4">
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                    Server: Online
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                    Database: Connected
                </div>
            </div>
         </div>
         
         <div className="bg-[#4A403A] p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C87941] rounded-full blur-[80px] opacity-30"></div>
            <h3 className="font-bold text-lg mb-6 relative z-10">Aksi Cepat</h3>
            <div className="space-y-3 relative z-10">
               <Link href="/admin/produk/tambah" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-center font-medium transition backdrop-blur-sm flex justify-between items-center group">
                  <span>+ Tambah Produk</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition" />
               </Link>
               <Link href="/admin/testimoni" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-center font-medium transition backdrop-blur-sm flex justify-between items-center group">
                  <span>Cek Ulasan Masuk</span>
                  {stats.pendingTestimoni > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{stats.pendingTestimoni}</span>
                  )}
               </Link>
               <Link href="/admin/laporan" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-center font-medium transition backdrop-blur-sm flex justify-between items-center group">
                  <span>Lihat Laporan Aset</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition" />
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}