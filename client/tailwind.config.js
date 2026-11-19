/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          bg: '#FBF8F1',
          card: '#FFFFFF',
          text: '#1C1917',
          sub: '#57534E',
          border: '#E7E0D3',
          red: '#8B1E1E',
          gold: '#B8860B'
        },
        night: {
          bg: '#121110',
          card: '#1A1816',
          text: '#EAE3D2',
          sub: '#A8A29E',
          border: '#38332B',
          red: '#A82828',
          gold: '#D4A373'
        },
        element: {
          kim: '#D97706',
          moc: '#16A34A',
          thuy: '#2563EB',
          hoa: '#DC2626',
          tho: '#B45309'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', '"Inter"', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
