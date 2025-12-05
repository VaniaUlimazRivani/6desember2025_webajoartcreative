"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Cek halaman admin
  const isAdminPage =
    pathname.startsWith("/admin") || pathname.includes("/admin/");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <main className="min-h-screen">{children}</main>

      {!isAdminPage && <Footer />}
    </>
  );
}
