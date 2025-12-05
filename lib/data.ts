import { ArrowUpRight, Package, FileText, MessageSquare, Leaf, Flame, Award, PenTool, LucideIcon } from 'lucide-react';

// --- INTERFACES (Definisi Tipe Data) ---

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  status: 'Aktif' | 'Habis';
  image: string;
  desc: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  from: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

// --- DATA DUMMY ---

export const productsData: Product[] = [
  { 
    id: 1, 
    name: 'Lampu Hias Ukir Naga', 
    category: 'Lampu Hias', 
    price: 250000, 
    stock: 12, 
    rating: 5,
    status: 'Aktif', 
    image: 'https://images.unsplash.com/photo-1513506003013-194a5d68d878?auto=format&fit=crop&q=80&w=600', 
    desc: 'Lampu tidur dengan ukiran naga detail, memberikan efek cahaya dramatis pada ruangan. Cocok untuk ruang tamu atau kamar tidur.' 
  },
  { 
    id: 2, 
    name: 'Jam Dinding Rustic', 
    category: 'Jam Dinding', 
    price: 85000, 
    stock: 5, 
    rating: 4.8,
    status: 'Aktif', 
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868c62171?auto=format&fit=crop&q=80&w=600', 
    desc: 'Jam dinding minimalis dengan tekstur bakar alami, memberikan sentuhan vintage yang elegan.' 
  },
  { 
    id: 3, 
    name: 'Vas Bunga Meja', 
    category: 'Desain Interior', 
    price: 45000, 
    stock: 0, 
    rating: 4.5,
    status: 'Habis', 
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=600', 
    desc: 'Vas bunga estetik dari paralon bakar untuk mempercantik meja kerja atau ruang tamu Anda.' 
  },
  { 
    id: 4, 
    name: 'Kursi Teras Paralon', 
    category: 'Bangku & Sofa', 
    price: 450000, 
    stock: 2, 
    rating: 5,
    status: 'Aktif', 
    image: 'https://images.unsplash.com/photo-1503602642458-23211144584b?auto=format&fit=crop&q=80&w=600', 
    desc: 'Kursi kokoh dengan rangka paralon beton, sangat tahan cuaca dan anti rayap. Cocok untuk teras.' 
  },
  { 
    id: 5, 
    name: 'Tas Anyam Paralon', 
    category: 'Tas', 
    price: 120000, 
    stock: 8, 
    rating: 4.7,
    status: 'Aktif', 
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600', 
    desc: 'Tas unik modis dari pipihan paralon yang dianyam secara manual dengan detail rapi.' 
  },
  { 
    id: 6, 
    name: 'Lampu Gantung Cafe', 
    category: 'Lampu Hias', 
    price: 175000, 
    stock: 15, 
    rating: 4.9,
    status: 'Aktif', 
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600', 
    desc: 'Kap lampu gantung dengan desain industrial, sangat cocok untuk penerangan cafe atau restoran.' 
  }
];

export const keunggulan: Feature[] = [
  { icon: Leaf, title: 'Ramah Lingkungan', desc: 'Mengolah limbah pipa menjadi karya seni bernilai tinggi.' },
  { icon: Flame, title: 'Teknik Bakar', desc: 'Motif natural yang dihasilkan dari proses pembakaran manual.' },
  { icon: Award, title: 'Kualitas Premium', desc: 'Finishing halus dengan pernis tahan lama dan anti rayap.' },
  { icon: PenTool, title: 'Desain Kustom', desc: 'Bisa request motif atau desain sesuai keinginan Anda.' },
];

export const testimonials: Testimonial[] = [
  { id: 1, name: 'Budi Santoso', text: 'Hasil bakarnya sangat artistik, tidak menyangka ini dari paralon bekas!', rating: 5, from: 'Padang' },
  { id: 2, name: 'Siti Aminah', text: 'Lampu hiasnya membuat suasana ruang tamu jadi sangat hangat dan cozy.', rating: 5, from: 'Bukittinggi' },
  { id: 3, name: 'Rahmat Hidayat', text: 'Kualitas kokoh, pengiriman aman. Sangat merekomendasikan untuk kado.', rating: 4, from: 'Jakarta' },
];

export const statsData: Stat[] = [
  { label: 'Total Penjualan', value: 'Rp 15.450.000', change: '+12%', icon: ArrowUpRight },
  { label: 'Total Produk', value: '125', change: '+4', icon: Package },
  { label: 'Pesanan Baru', value: '18', change: 'Minggu ini', icon: FileText },
  { label: 'Testimoni', value: '45', change: '+3 pending', icon: MessageSquare },
];