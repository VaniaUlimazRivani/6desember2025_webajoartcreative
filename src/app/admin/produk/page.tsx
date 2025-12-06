'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { productsData, Product } from '@/lib/data';

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [search, setSearch] = useState<string>('');

  const handleDelete = (id: number) => {
    if(confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-[#E6D5B8]">
        <h1 className="text-xl font-bold text-[#4A403A] pl-2">Daftar Produk</h1>
        <Link href="/admin/produk/tambah" className="bg-[#C87941] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#b06a38] transition shadow-md">
          <Plus size={18} /> Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#E6D5B8] overflow-hidden">
        <div className="p-5 border-b border-[#E6D5B8] bg-[#FDFCF5]">
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Cari nama produk..." 
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-[#C87941] focus:border-transparent outline-none transition"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#FDFCF5] transition">
                  <td className="px-6 py-4 font-medium text-[#4A403A]">{product.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{product.category}</td>
                  <td className="px-6 py-4 text-[#C87941] font-bold">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock > 0 ? 'Aktif' : 'Habis'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"><Trash2 size={16}/></button>
                    </div>
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