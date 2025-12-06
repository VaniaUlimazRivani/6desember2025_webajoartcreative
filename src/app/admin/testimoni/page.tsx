'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Eye, Trash2, MessageSquare, Star, EyeOff } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  status: 'Published' | 'Pending' | 'Hidden';
  date: string;
}

export default function AdminTestimonialPage() {
  // Data awal dummy agar admin tidak kosong saat pertama kali dibuka
  const initialTestimonials: Testimonial[] = [
    { id: 1, name: 'Budi Santoso', text: 'Barang sangat bagus, unik dan artistik.', rating: 5, status: 'Published', date: '2025-02-20' },
    { id: 2, name: 'Siti Aminah', text: 'Pengiriman agak lama tapi barang oke.', rating: 4, status: 'Pending', date: '2025-02-21' },
    { id: 3, name: 'Rahmat Hidayat', text: 'Kurang suka dengan finishingnya.', rating: 3, status: 'Hidden', date: '2025-02-22' },
  ];

  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulasi Fetch Data (Menggunakan data dummy jika API belum siap/kosong)
  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/testimoni');
      if (res.ok) {
        const data = await res.json();
        // Jika API mengembalikan array kosong (karena restart server), gunakan data dummy awal
        if (Array.isArray(data) && data.length > 0) {
           setReviews(data);
        } else {
           setReviews(initialTestimonials);
        }
      } else {
        // Fallback ke data dummy jika API error
        setReviews(initialTestimonials);
      }
    } catch (error) {
      console.error("Gagal ambil data, menggunakan data lokal.");
      setReviews(initialTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Update Status (Terbitkan / Sembunyikan)
  const updateStatus = async (id: number, newStatus: 'Published' | 'Pending' | 'Hidden') => {
    // Optimistic Update: Update UI dulu biar cepat
    const previousReviews = [...reviews];
    setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));

    try {
      const res = await fetch('/api/testimoni', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Gagal update di server");
      }
    } catch (error) {
      alert("Gagal update status di server, mengembalikan perubahan.");
      setReviews(previousReviews); // Rollback jika gagal
    }
  };

  // Hapus Testimoni
  const deleteReview = async (id: number) => {
    if (!confirm('Hapus testimoni ini permanen?')) return;

    // Optimistic Update
    const previousReviews = [...reviews];
    setReviews(reviews.filter(r => r.id !== id));

    try {
      const res = await fetch(`/api/testimoni?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error("Gagal hapus di server");
      }
    } catch (error) {
      alert("Gagal menghapus data di server.");
      setReviews(previousReviews); // Rollback
    }
  };

  const getStatusBadge = (status: string) => {
    if(status === 'Published') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Tayang</span>;
    if(status === 'Pending') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200 animate-pulse">Menunggu</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">Sembunyi</span>;
  };

  return (
    <div className="space-y-8 animate-fade-in p-6">
      
      {/* Header Admin */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <MessageSquare size={28} className="text-[#0ea5e9]"/> Moderasi Testimoni
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-10">Kelola ulasan masuk. Pilih ulasan terbaik untuk ditampilkan di halaman depan.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-[#0ea5e9]">{reviews.length}</span>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Ulasan</p>
        </div>
      </div>

      {/* Tabel Modern */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-48">Pelanggan</th>
                <th className="px-6 py-4">Ulasan</th>
                <th className="px-6 py-4 w-32">Rating</th>
                <th className="px-6 py-4 w-32">Status</th>
                <th className="px-6 py-4 text-right w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Memuat data...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">Belum ada testimoni masuk.</td></tr>
              ) : reviews.map((review) => (
                <tr key={review.id} className="hover:bg-blue-50/30 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{review.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{review.date}</p>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="text-gray-600 text-sm italic line-clamp-2">"{review.text}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-[#fbbf24]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} stroke={i < review.rating ? "none" : "currentColor"} className="text-gray-300" />)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(review.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      
                      {/* Tombol Terbitkan (Hanya muncul jika belum published) */}
                      {review.status !== 'Published' && (
                        <button
                          onClick={() => updateStatus(review.id, 'Published')}
                          className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition border border-green-100"
                          title="Terbitkan (Tampilkan di Web)"
                        >
                          <CheckCircle size={18}/>
                        </button>
                      )}

                      {/* Tombol Sembunyikan (Hanya muncul jika published) */}
                      {review.status === 'Published' && (
                        <button
                          onClick={() => updateStatus(review.id, 'Hidden')}
                          className="p-2 text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
                          title="Sembunyikan (Tarik dari Web)"
                        >
                          <EyeOff size={18}/>
                        </button>
                      )}

                      {/* Tombol Hapus */}
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition border border-red-100"
                        title="Hapus Permanen"
                      >
                        <Trash2 size={18}/>
                      </button>
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