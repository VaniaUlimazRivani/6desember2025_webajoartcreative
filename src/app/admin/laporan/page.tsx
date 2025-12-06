'use client';
import { Calendar, Download, Printer } from 'lucide-react';

const salesReportMock = [
  { id: 'INV-001', date: '2025-02-20', customer: 'Budi Santoso', items: 'Lampu Hias (1)', total: 250000, status: 'Selesai' },
  { id: 'INV-002', date: '2025-02-21', customer: 'Siti Aminah', items: 'Jam Dinding (2)', total: 170000, status: 'Selesai' },
];

export default function ReportPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center no-print bg-white p-5 rounded-2xl border border-[#E6D5B8] shadow-sm">
        <h1 className="text-xl font-bold text-[#4A403A]">Laporan Penjualan</h1>
        <button onClick={handlePrint} className="bg-[#4A403A] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#362f2b] flex items-center gap-2 shadow-md transition">
          <Printer size={18} /> Cetak / PDF
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8] flex flex-wrap gap-6 items-end no-print">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Mulai</label>
          <div className="relative">
            <input type="date" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#C87941]" />
            <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Akhir</label>
          <div className="relative">
            <input type="date" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#C87941]" />
            <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>
        <button className="bg-[#E6D5B8] text-[#4A403A] px-8 py-3 rounded-xl font-bold hover:bg-[#dccfb6] transition h-[50px]">
          Filter Data
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#E6D5B8] overflow-hidden" id="printable-area">
        <div className="hidden print:block p-8 text-center border-b border-gray-200">
          <h2 className="text-3xl font-bold text-[#4A403A]">AJO ART CREATIVE</h2>
          <p>Laporan Rekapitulasi Penjualan</p>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#FDFCF5] text-gray-600 text-xs uppercase font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID Invoice</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Pelanggan</th>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {salesReportMock.map((row) => (
              <tr key={row.id} className="hover:bg-[#FDFCF5]">
                <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{row.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
                <td className="px-6 py-4 font-medium text-[#4A403A]">{row.customer}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{row.items}</td>
                <td className="px-6 py-4 font-bold text-[#C87941] text-right">Rp {row.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold border border-green-200">{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style jsx global>{`
        @media print {
          .no-print, aside, header { display: none !important; }
          .main-content { padding: 0 !important; margin: 0 !important; }
          body { background: white !important; }
          #printable-area { border: none !important; shadow: none !important; }
        }
      `}</style>
    </div>
  );
}