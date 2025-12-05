'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import { productsData } from '@/lib/data';

export default function ProductDetail({ params }) {
  const unwrappedParams = use(params);
  const productId = parseInt(unwrappedParams.id);
  const product = productsData.find(p => p.id === productId);

  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    text: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert(`Terima kasih ${reviewForm.name}! Ulasan Anda telah terkirim dan menunggu persetujuan Admin.`);
      setReviewForm({ name: '', rating: 5, text: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFCF5] flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#4A403A]">Produk Tidak Ditemukan</h2>
          <Link href="/katalog" className="text-[#C87941] hover:underline mt-4 block">Kembali ke Katalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF5] font-sans">

      {/* ❗ NAVBAR DIHILANGKAN (sudah ada di ClientWrapper) */}

      <div className="pt-32 pb-16 px-4 max-w-6xl mx-auto min-h-screen">
        
        <Link href="/katalog" className="mb-8 flex items-center gap-2 font-medium text-gray-500 hover:text-[#C87941] w-fit transition">
          <ArrowLeft size={20} /> Kembali ke Katalog
        </Link>

        {/* DETAIL PRODUK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Gambar */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-white border border-[#E6D5B8] shadow-lg aspect-4/5 relative group">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
          </div>

          {/* Informasi Produk */}
          <div className="flex flex-col">
            <span className="inline-block px-3 py-1 rounded-md bg-[#E6D5B8]/50 text-[#C87941] text-xs font-bold uppercase tracking-wider w-fit mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight text-[#4A403A]">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                <Star fill="currentColor" size={18} /> 
                <span className="font-bold text-gray-800 ml-1">{product.rating}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {product.stock > 0 ? `Stok Tersedia (${product.stock})` : "Stok Habis"}
              </span>
            </div>

            <p className="text-4xl font-bold mb-8 text-[#C87941]">
              Rp {product.price.toLocaleString('id-ID')}
            </p>

            <div className="space-y-6 mb-10">
              <div>
                <h3 className="font-bold text-lg mb-2 text-[#4A403A]">Tentang Produk</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.desc} Mahakarya pengrajin Ajo Art yang menggabungkan fungsi dan estetika. 
                  Tekstur unik pada permukaan paralon dihasilkan melalui teknik pembakaran presisi.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#E6D5B8] rounded-xl shadow-sm">
                  <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Bahan</span>
                  <span className="font-bold text-[#4A403A]">PVC Paralon Grade A</span>
                </div>
                <div className="p-4 bg-white border border-[#E6D5B8] rounded-xl shadow-sm">
                  <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Finishing</span>
                  <span className="font-bold text-[#4A403A]">Bakar Natural & Pernis</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 bg-green-50 p-3 rounded-lg border border-green-100">
                <ShieldCheck size={18} className="text-green-600"/> 
                Garansi kerusakan saat pengiriman
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button 
                onClick={() => window.open(`https://wa.me/6281236007061?text=Halo Ajo Art, saya tertarik dengan produk ${product.name}`, '_blank')}
                className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex items-center justify-center gap-3 bg-[#4A403A]"
              >
                <ShoppingBag size={24} />
                Pesan Sekarang (WhatsApp)
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">Transaksi aman dan langsung terhubung dengan pengrajin.</p>
            </div>
          </div>
        </div>

        {/* FORM ULASAN */}
        <div className="border-t border-[#E6D5B8] pt-12 mt-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-[#4A403A] text-center mb-2">Ulasan Pembeli</h2>
            <p className="text-center text-gray-500 mb-8">Puas dengan produk kami? Ceritakan pengalaman Anda.</p>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E6D5B8] shadow-sm">
              <form onSubmit={handleSubmitReview} className="space-y-5">
                
                {/* Input Nama */}
                <div>
                  <label className="block text-sm font-bold text-[#4A403A] mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 rounded-xl border border-gray-200 bg-[#FDFCF5] focus:outline-none focus:border-[#C87941] focus:ring-1 focus:ring-[#C87941] transition"
                    placeholder="Masukkan nama Anda"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-bold text-[#4A403A] mb-2">Rating Kepuasan</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className="focus:outline-none transition transform hover:scale-110"
                      >
                        <Star 
                          size={32} 
                          className={star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Komentar */}
                <div>
                  <label className="block text-sm font-bold text-[#4A403A] mb-2">Ceritakan Pengalaman Anda</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-[#FDFCF5] focus:outline-none focus:border-[#C87941] focus:ring-1 focus:ring-[#C87941] transition resize-none"
                    placeholder="Kualitas barang sangat bagus, pengiriman cepat..."
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#C87941] text-white font-bold rounded-xl hover:bg-[#b06a38] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Mengirim...' : (
                    <>
                      Kirim Ulasan <Send size={18} />
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-gray-400 mt-2">
                  *Ulasan akan ditampilkan setelah disetujui oleh Admin.
                </p>
              </form>
            </div>
          </div>
        </div>

      </div>

      {/* ❗ FOOTER DIHILANGKAN (sudah otomatis dari ClientWrapper) */}

    </div>
  );
}
