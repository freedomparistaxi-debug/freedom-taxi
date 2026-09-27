/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050D18',
          900: '#071426',
          850: '#09182C',
          800: '#0B1D33',
          700: '#112B4C',
          600: '#1A3F6D',
        },
        gold: {
          300: '#F5DE98',
          400: '#E8C96A',
          500: '#D4AF37',
          600: '#B89325',
        },
        brandBlue: {
          400: '#2A7FD6',
          500: '#1D67B1',
          600: '#155291',
        },
        surface: {
          light: '#F7F9FC',
          card: '#FFFFFF',
          darkCard: '#0D2139',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card-soft': '0 10px 30px -5px rgba(7, 20, 38, 0.08), 0 4px 12px -2px rgba(7, 20, 38, 0.04)',
        'card-hover': '0 20px 40px -10px rgba(7, 20, 38, 0.16), 0 8px 18px -4px rgba(7, 20, 38, 0.08)',
        'glow-gold': '0 0 25px rgba(232, 201, 106, 0.35)',
        'glow-blue': '0 0 25px rgba(29, 103, 177, 0.35)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
      }
    },
  },
  plugins: [],
}
