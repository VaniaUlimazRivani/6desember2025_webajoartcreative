// src/components/ClientWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import React from 'react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';

  // treat any route that starts with /admin as admin page
  const isAdminPage = pathname.startsWith('/admin');

  // If admin page, do not render Navbar/Footer, and do not wrap in main
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Public pages: render Navbar + main + Footer
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
