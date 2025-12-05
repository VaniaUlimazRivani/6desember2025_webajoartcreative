'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  LayoutDashboard, Package, Tags, FileText,
  MessageSquare, Settings, LogOut, Edit,
  Menu, User, Flame
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const pathname = usePathname() || "";
  const router = useRouter();

  /** Hindari error hydration */
  useEffect(() => {
    setMounted(true);
  }, []);

  /** Proteksi login */
  useEffect(() => {
    if (!mounted) return;

    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) router.push('/login');
  }, [mounted, router]);


  const handleLogout = () => {
    if (confirm("Yakin ingin keluar dari panel admin?")) {
      localStorage.removeItem("isLoggedIn");
      router.push("/login");
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Package, label: "Produk", href: "/admin/produk" },
    { icon: Tags, label: "Kategori", href: "/admin/kategori" },
    { icon: FileText, label: "Laporan", href: "/admin/laporan" },
    { icon: MessageSquare, label: "Testimoni", href: "/admin/testimoni" },
    { icon: Edit, label: "Konten Web", href: "/admin/konten" },
    { icon: Settings, label: "Pengaturan", href: "/admin/pengaturan" },
  ];

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F7F2] text-[#4A403A] font-sans">

      {/* Background untuk mobile sidebar */}
      {mobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#4A403A] text-white 
        transform ${mobileSidebar ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 z-40 flex flex-col shadow-xl`}
      >

        {/* SIDEBAR HEADER */}
        <div className="h-24 flex items-center px-8 border-b border-white/10 gap-3">
          <div className="bg-[#C87941] p-2 rounded-lg">
            <Flame size={24} />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-wider block">AJO ART</span>
            <span className="text-[10px] text-gray-300 uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Menu Utama
          </p>

          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebar(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${isActive
                    ? "bg-[#C87941] text-white shadow-lg shadow-[#C87941]/40 font-medium translate-x-1"
                    : "text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1"
                  }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-white" : "text-gray-400 group-hover:text-white"}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* LOGOUT BUTTON */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 
            text-red-300 hover:bg-white/10 hover:text-red-200 
            rounded-xl transition font-medium"
          >
            <LogOut size={20} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* HEADER */}
        <header className="bg-white border-b px-8 py-5 flex justify-between items-center 
        sticky top-0 z-20 shadow-sm border-[#E6D5B8]">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMobileSidebar(true)}
            >
              <Menu className="text-[#4A403A]" />
            </button>

            <h2 className="hidden lg:block text-xl font-bold font-serif text-[#4A403A]">
              {menuItems.find(i => i.href === pathname)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#4A403A]">Vania Ulimaz</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>

            <div className="w-12 h-12 rounded-full bg-[#FDFCF5] border-2 border-[#E6D5B8] 
            text-[#C87941] flex items-center justify-center shadow-sm">
              <User size={24} />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F8F7F2]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
