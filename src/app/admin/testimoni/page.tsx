'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, CheckCircle, XCircle, Trash2, MessageSquare, Clock } from 'lucide-react';

interface Testimoni {
  id: number;
  name: string;
  text: string;
  rating: number;
  status: string;
  date: string;
}

export default function AdminTestimoniPage() {
  const [data, setData] = useState<Testimoni[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const res = await fetch('/api/testimoni');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- APPROVE (PUBLISH) ---
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/testimoni/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchData(); // Refresh data
    } catch (error) {
      alert('Gagal update status');
    }
  };

  // --- DELETE ---
  const handleDelete = async (id: number) => {
    if (!confirm('Hapus ulasan ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/testimoni/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      alert('Gagal hapus');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="p-2 rounded-full bg-white border border-[#E6D5B8] text-gray-500 hover:text-[#C87941] transition">
             <ArrowLeft size={20} />
          </Link>
          <div>
             <h1 className="text-3xl font-serif font-bold text-[#4A403A]">Moderasi Testimoni</h1>
             <p className="text-gray-500">Setujui ulasan pelanggan sebelum tampil di website.</p>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E6D5B8] overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-gray-500 animate-pulse">Memuat ulasan...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FAF8F1] border-b border-[#E6D5B8] text-[#4A403A]">
                  <tr>
                    <th className="p-5 font-bold text-sm uppercase">Pelanggan</th>
                    <th className="p-5 font-bold text-sm uppercase">Ulasan & Rating</th>
                    <th className="p-5 font-bold text-sm uppercase text-center">Status</th>
                    <th className="p-5 font-bold text-sm uppercase text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.length > 0 ? (
                    data.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        
                        {/* Nama & Tanggal */}
                        <td className="p-5 align-top w-1/4">
                          <div className="font-bold text-[#4A403A]">{item.name}</div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock size={12} /> {new Date(item.date).toLocaleDateString('id-ID')}
                          </div>
                        </td>

                        {/* Isi Ulasan */}
                        <td className="p-5 align-top w-1/2">
                          <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed italic">"{item.text}"</p>
                        </td>

                        {/* Status Badge */}
                        <td className="p-5 align-top text-center">
                          {item.status === 'Published' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                              <CheckCircle size={12} /> Tayang
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200 animate-pulse">
                              <Clock size={12} /> Pending
                            </span>
                          )}
                        </td>

                        {/* Tombol Aksi */}
                        <td className="p-5 align-top text-right">
                          <div className="flex justify-end gap-2">
                            {item.status === 'Pending' && (
                              <button 
                                onClick={() => handleStatusChange(item.id, 'Published')}
                                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition"
                                title="Setujui & Tampilkan"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            
                            {item.status === 'Published' && (
                              <button 
                                onClick={() => handleStatusChange(item.id, 'Pending')}
                                className="p-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition"
                                title="Sembunyikan (Set ke Pending)"
                              >
                                <XCircle size={18} />
                              </button>
                            )}

                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                              title="Hapus Permanen"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-gray-400">
                        Belum ada ulasan masuk.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}