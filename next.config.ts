import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Mengizinkan gambar placeholder
        port: '',
        pathname: '/**',
      },
      // Tambahkan blok di bawah ini jika nanti Anda menggunakan Cloudinary atau domain lain
      /*
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      */
    ],
  },
};

export default nextConfig;