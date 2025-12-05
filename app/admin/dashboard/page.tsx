import { ArrowUpRight, Package, FileText, MessageSquare, TrendingUp, LucideIcon } from 'lucide-react';
import { statsData } from '@/lib/data';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => (
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
    <p className="text-3xl font-bold text-[#4A403A]">{value}</p>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Selamat Datang, Admin!</h1>
        <p className="text-gray-500 mt-1">Berikut adalah ringkasan aktivitas toko Anda hari ini.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Penjualan" value="Rp 15.4Jt" change="+12%" icon={TrendingUp} color="bg-green-500" />
        <StatCard title="Total Produk" value="125" change="+4" icon={Package} color="bg-blue-500" />
        <StatCard title="Pesanan Baru" value="18" change="Minggu ini" icon={FileText} color="bg-orange-500" />
        <StatCard title="Testimoni" value="45" change="+3 pending" icon={MessageSquare} color="bg-purple-500" />
      </div>

      {/* Shortcut Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#E6D5B8] shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-[#4A403A]">Penjualan Terakhir</h3>
            <div className="flex items-center justify-center h-40 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
               [Grafik Penjualan Placeholder]
            </div>
         </div>
         
         <div className="bg-[#4A403A] p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C87941] rounded-full blur-[80px] opacity-30"></div>
            <h3 className="font-bold text-lg mb-6 relative z-10">Aksi Cepat</h3>
            <div className="space-y-3 relative z-10">
               <a href="/admin/produk/tambah" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-center font-medium transition backdrop-blur-sm">
                  + Tambah Produk
               </a>
               <a href="/admin/laporan" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-center font-medium transition backdrop-blur-sm">
                  Cetak Laporan
               </a>
            </div>
         </div>
      </div>
    </div>
  );
}