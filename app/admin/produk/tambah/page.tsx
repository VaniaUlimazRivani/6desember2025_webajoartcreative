'use client';
import Link from 'next/link';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export default function AddProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/produk" className="p-2.5 rounded-full bg-white border border-[#E6D5B8] hover:bg-gray-50 transition text-[#4A403A]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#4A403A]">Tambah Produk</h1>
          <p className="text-gray-500 text-sm">Masukkan detail produk kerajinan baru.</p>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8] space-y-5">
            <h3 className="font-bold text-lg border-b border-gray-100 pb-4 mb-4 text-[#4A403A]">Informasi Dasar</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none transition" placeholder="Contoh: Lampu Hias Naga" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Harga (Rp)</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none transition" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stok</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none transition" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
              <textarea rows={6} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none transition" placeholder="Jelaskan keunikan produk ini..."></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <h3 className="font-bold text-lg border-b border-gray-100 pb-4 mb-4 text-[#4A403A]">Media</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 transition cursor-pointer group">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#E6D5B8] transition">
                <Upload size={24} className="text-gray-400 group-hover:text-[#4A403A]" />
              </div>
              <p className="text-sm font-medium text-gray-600">Klik untuk upload gambar</p>
              <p className="text-xs text-gray-400 mt-1">JPG/PNG, Maks 2MB</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E6D5B8]">
            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
            <select className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#C87941] outline-none transition">
              <option>Pilih Kategori...</option>
              <option>Lampu Hias</option>
              <option>Jam Dinding</option>
              <option>Desain Interior</option>
            </select>
          </div>

          <button type="button" className="w-full py-4 bg-[#C87941] text-white font-bold rounded-xl shadow-lg hover:bg-[#b06a38] transition transform active:scale-95 flex items-center justify-center gap-2">
            <Save size={20} /> Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}