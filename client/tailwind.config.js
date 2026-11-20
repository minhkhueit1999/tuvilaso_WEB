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
          bg: '#F5F0E3',         // Giấy Tuyên Chỉ
          card: '#FAF6EC',       // Giấy Cổ Nhạt
          cardAlt: '#F3ECE0',    // Giấy Cổ Đậm
          border: '#E5D9C5',     // Viền Mộc Bản
          text: '#1C1915',       // Mực Tùng Yên (Chữ chính)
          muted: '#5E5549',      // Mực Nhạt (Chữ phụ)
          red: '#9E2A22',        // Đỏ Chu Sa / Ấn Triện
          redHover: '#7D1E18',   // Đỏ Chu Sa Đậm
          gold: '#9A7B3E',       // Cổ Đồng Kim
          goldLight: '#E8D8B8',  // Đồng Kim Sáng
          jade: '#245B43',       // Thanh Ngọc (Cát / Phi Lộc)
          azure: '#234B6E'       // Thiên Thanh (Khoa / Phi Khoa)
        },
        night: {
          bg: '#141210',         // Sơn Mài Đen Ấm
          card: '#1C1916',       // Sơn Mài Card
          cardAlt: '#231F1C',
          border: '#362F27',     // Viền Đồng Mờ
          text: '#E8DFCE',       // Ngà Cổ (Chữ chính)
          muted: '#9E9382',      // Chữ phụ
          red: '#C94A40',        // Đỏ Chu Sa Dịu
          gold: '#C5A059',       // Vàng Đồng Cổ
          goldLight: '#3D3428',
          jade: '#4ADE80',
          azure: '#60A5FA'
        },
        elem: {
          kim: '#525B66',
          kimDark: '#CBD5E1',
          moc: '#1B6B3A',
          mocDark: '#4ADE80',
          thuy: '#1E4D8C',
          thuyDark: '#60A5FA',
          hoa: '#B91C1C',
          hoaDark: '#F87171',
          tho: '#C27803',
          thoDark: '#FBBF24'
        }
      },
      fontFamily: {
        serif: ['"Noto Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '2px',
        DEFAULT: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px'
      }
    },
  },
  plugins: [],
}
