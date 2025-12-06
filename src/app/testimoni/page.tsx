'use client';

import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';

type Testimonial = {
  id: number;
  name: string;
  text: string;
  rating: number;
  date: string;
};

export default function TestimoniPublikPage() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Form
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data testimoni yang Published
  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/testimoni?type=public');
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Gagal ambil testimoni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Kirim Testimoni Baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/testimoni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text: message, rating }),
      });

      if (res.ok) {
        alert("Terima kasih! Ulasan Anda telah dikirim dan menunggu persetujuan admin.");
        setName('');
        setMessage('');
        setRating(5);
      } else {
        alert("Gagal mengirim ulasan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#fbbf24] selection:text-white pt-28 pb-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-16">
        <span className="text-[#0ea5e9] font-bold tracking-widest uppercase text-xs mb-3 block">Suara Pelanggan</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Apa Kata Mereka?</h1>
        <p className="text-gray-500 text-lg font-light">
          Pengalaman nyata dari pelanggan yang telah mempercantik rumah mereka dengan karya Ajo Art Creative.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* KOLOM KIRI: Daftar Testimoni */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-[#fbbf24] pl-4">Ulasan Terbaru</h2>
          
          {loading ? (
            <div className="text-gray-400">Memuat ulasan...</div>
          ) : reviews.length > 0 ? (
            <div className="grid gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0ea5e9] font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex text-[#fbbf24]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-[#fbbf24]" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{review.text}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Belum ada ulasan yang ditampilkan.</p>
          )}
        </div>

        {/* KOLOM KANAN: Form Input */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-4xl shadow-xl border border-gray-100 sticky top-32">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tulis Ulasan Anda</h3>
            <p className="text-gray-500 text-sm mb-6">Bagikan pengalaman Anda berbelanja di sini.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0ea5e9] outline-none transition text-gray-800"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={28} 
                        fill={star <= rating ? "#fbbf24" : "none"} 
                        className={star <= rating ? "text-[#fbbf24]" : "text-gray-300"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Ulasan</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0ea5e9] outline-none transition text-gray-800"
                  placeholder="Ceritakan kepuasan Anda..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl transition shadow-lg ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0ea5e9] hover:bg-[#0284c7] hover:shadow-blue-200'
                }`}
              >
                <Send size={18} />
                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}