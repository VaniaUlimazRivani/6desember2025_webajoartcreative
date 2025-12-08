'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, ShieldCheck, ShoppingBag, Send } from 'lucide-react';
import Navbar from '@/components/ui/Navbar'; 

interface Product {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string;
  gambar: string;
  kategori: { nama: string };
}

export default function PublicProductDetailPage() {
  const params = useParams();
  const id = params.id; 

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    text: '',
  });

  // Fetch Produk
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/produk/${id}`);
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  // Handle Kirim Ulasan
  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Kirim ke API
      const res = await fetch('/api/testimoni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewForm.name,
          text: reviewForm.text,
          rating: reviewForm.rating,
        }),
      });

      if (res.ok) {
        alert(`Terima kasih ${reviewForm.name}! Ulasan Anda telah terkirim dan menunggu persetujuan Admin.`);
        setReviewForm({ name: '', rating: 5, text: '' }); // Reset form
      } else {
        const err = await res.json();
        alert('Gagal mengirim ulasan: ' + (err.message || 'Error server'));
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan sistem saat mengirim ulasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#FDFCF5] flex items-center justify-center text-gray-500">Memuat...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Produk tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans">
      <Navbar /> 
      <div className="pt-32 pb-16 px-4 max-w-6xl mx-auto min-h-screen">
        
        <Link href="/katalog" className="flex items-center gap-2 text-gray-500 hover:text-[#C87941] mb-8 w-fit transition">
          <ArrowLeft size={20} /> Kembali ke Katalog
        </Link>

        {/* DETAIL PRODUK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-20">
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-white border border-[#E6D5B8] shadow-lg aspect-4/5 relative group">
              <img src={product.gambar || 'https://via.placeholder.com/500'} alt={product.nama} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="inline-block px-3 py-1 rounded-md bg-[#E6D5B8]/50 text-[#C87941] text-xs font-bold uppercase tracking-wider w-fit mb-4">
              {product.kategori?.nama || 'Umum'}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#4A403A]">{product.nama}</h1>
            <p className="text-4xl font-bold mb-8 text-[#C87941]">Rp {product.harga.toLocaleString('id-ID')}</p>
            <div className="space-y-6 mb-10">
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{product.deskripsi}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-green-50 p-3 rounded-lg border border-green-100">
                <ShieldCheck size={18} className="text-green-600" /> Garansi kerusakan saat pengiriman
              </div>
            </div>
            <button onClick={() => window.open(`https://wa.me/6281236007061?text=Halo, saya tertarik dengan produk ${product.nama}`, '_blank')} className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-xl hover:shadow-2xl transition bg-[#4A403A] flex items-center justify-center gap-3">
               <ShoppingBag size={24} /> Pesan Sekarang (WhatsApp)
            </button>
          </div>
        </div>

        {/* FORM ULASAN (YANG DIPERBAIKI) */}
        <div className="border-t border-[#E6D5B8] pt-12 mt-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-[#4A403A] text-center mb-2">Ulasan Pembeli</h2>
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E6D5B8] shadow-sm mt-8">
              <form onSubmit={handleSubmitReview} className="space-y-5">
                
                {/* Input Nama */}
                <div>
                  <label className="block text-sm font-bold text-[#4A403A] mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 rounded-xl border border-gray-300 bg-[#FDFCF5] text-gray-900 font-medium focus:outline-none focus:border-[#C87941] focus:ring-1 focus:ring-[#C87941] transition placeholder-gray-400"
                    placeholder="Masukkan nama Anda"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  />
                </div>

                {/* Input Rating */}
                <div>
                  <label className="block text-sm font-bold text-[#4A403A] mb-2">Rating Kepuasan</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                        <Star size={32} className={star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Komentar */}
                <div>
                  <label className="block text-sm font-bold text-[#4A403A] mb-2">Ceritakan Pengalaman Anda</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-[#FDFCF5] text-gray-900 font-medium focus:outline-none focus:border-[#C87941] focus:ring-1 focus:ring-[#C87941] transition resize-none placeholder-gray-400"
                    placeholder="Contoh: Barang bagus, pengiriman cepat..."
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#C87941] text-white font-bold rounded-xl hover:bg-[#b06a38] transition flex items-center justify-center gap-2 disabled:opacity-70">
                  {isSubmitting ? 'Mengirim...' : <><Send size={18} /> Kirim Ulasan</>}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}