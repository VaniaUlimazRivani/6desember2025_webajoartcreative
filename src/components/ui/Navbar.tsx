'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Flame, User } from 'lucide-react';

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="fixed w-full z-50 py-4 bg-[#4A403A] text-[#FDFCF5] shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold tracking-wider cursor-pointer flex items-center gap-2 hover:text-[#C87941] transition">
          <Flame size={24} className="text-[#C87941]" />
          AJO ART
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium items-center">
          <Link href="/" className="hover:text-[#C87941] transition duration-200">Beranda</Link>
          <Link href="/katalog" className="hover:text-[#C87941] transition duration-200">Katalog</Link>
          <Link href="/kontak" className="hover:text-[#C87941] transition duration-200">Kontak</Link>
          
          {/* Tombol Login Admin */}
          <Link href="/login" className="px-5 py-2 border border-[#C87941] text-[#C87941] rounded-full hover:bg-[#C87941] hover:text-white transition duration-300 font-bold text-sm flex items-center gap-2">
            <User size={16} /> Admin
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenu(!mobileMenu)} className="text-[#FDFCF5] hover:text-[#C87941] transition">
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenu && (
        <div className="md:hidden absolute w-full p-4 flex flex-col gap-4 shadow-xl border-t border-gray-700 bg-[#4A403A] animate-fade-in">
          <Link href="/" onClick={() => setMobileMenu(false)} className="text-left py-3 border-b border-gray-700 hover:text-[#C87941] transition">Beranda</Link>
          <Link href="/katalog" onClick={() => setMobileMenu(false)} className="text-left py-3 border-b border-gray-700 hover:text-[#C87941] transition">Katalog</Link>
          <Link href="/kontak" onClick={() => setMobileMenu(false)} className="text-left py-3 border-b border-gray-700 hover:text-[#C87941] transition">Kontak</Link>
          <Link href="/login" onClick={() => setMobileMenu(false)} className="text-left py-3 font-bold text-[#C87941]">Login Admin</Link>
        </div>
      )}
    </nav>
  );
}