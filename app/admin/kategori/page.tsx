'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Mock Data Lokal untuk Kategori
const initialCats = [
    { id: 1, name: 'Lampu Hias', count: 12 },
    { id: 2, name: 'Jam Dinding', count: 8 },
    { id: 3, name: 'Desain Interior', count: 5 },
];

export default function CategoryPage() {
  const [categories, setCategories] = useState(initialCats);
  const [newCat, setNewCat] = useState('');

  const handleAdd = () => {
    if(!newCat) return;
    setCategories([...categories, { id: Date.now(), name: newCat, count: 0 }]);
    setNewCat('');
  };

  const handleDelete = (id: number) => {
    if(confirm('Hapus kategori ini?')) setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-[#4A403A] font-serif">Kategori Produk</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Tambah */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8] h-fit">
          <h3 className="font-bold mb-6 text-[#4A403A] text-lg">Tambah Baru</h3>
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Kategori</label>
                <input 
                type="text" 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="Contoh: Souvenir"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C87941] outline-none transition"
                />
            </div>
            <button onClick={handleAdd} className="w-full bg-[#C87941] text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md">
              <Plus size={18} /> Simpan Kategori
            </button>
          </div>
        </div>

        {/* List Kategori */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-[#E6D5B8] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#FDFCF5] text-gray-600 text-xs uppercase font-bold border-b border-gray-100">
              <tr>
                <th className="px-8 py-4">Nama</th>
                <th className="px-8 py-4">Jumlah Produk</th>
                <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#FDFCF5] transition">
                  <td className="px-8 py-4 font-bold text-[#4A403A]">{cat.name}</td>
                  <td className="px-8 py-4 text-gray-500">{cat.count} Item</td>
                  <td className="px-8 py-4 text-right flex justify-end gap-2">
                    <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}