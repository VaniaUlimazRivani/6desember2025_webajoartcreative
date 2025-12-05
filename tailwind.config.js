/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FDFCF5',    // Cream (Background Utama)
        secondary: '#4A403A',  // Dark Coffee (Sidebar/Teks/Footer)
        accent: '#C87941',     // Terracotta (Aksen/Tombol)
        surface: '#E6D5B8',    // Beige (Card Background)
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};