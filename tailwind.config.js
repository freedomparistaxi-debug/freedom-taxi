/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bleu de marque : couleur principale, sobre et professionnelle.
        brand: {
          50:  '#F2F7FC',
          100: '#E3EEF9',
          200: '#C3DCF1',
          300: '#94C1E4',
          400: '#5D9FD2',
          500: '#2F7FC0',
          600: '#1D639D',
          700: '#164E7C',
          800: '#123D5E',
          900: '#0F2E47',
        },
        // Bleu profond : reserve aux zones de contraste (pied de page,
        // petits blocs d'appui). Evite le « gros bleu nuit » d'avant.
        navy: {
          950: '#0B2136',
          900: '#0F2E47',
          850: '#153A57',
          800: '#1B4667',
          700: '#245A80',
          600: '#2F6E9B',
        },
        // Or : utilise avec parcimonie (filets, icones, un seul accent).
        gold: {
          200: '#F6E7BC',
          300: '#EFD68E',
          400: '#E3C263',
          500: '#C9A227',
          600: '#A5851D',
        },
        brandBlue: {
          400: '#5D9FD2',
          500: '#2F7FC0',
          600: '#1D639D',
        },
        surface: {
          light:  '#F6F8FB',
          card:   '#FFFFFF',
          darkCard: '#12304A',
        },
        // Texte : gris fonce, jamais noir pur.
        ink: {
          900: '#15212E',
          700: '#33455A',
          500: '#5A6B80',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        // Ombres tres legeres : le relief vient de la bordure, pas de l'ombre.
        'card-soft': '0 1px 2px rgba(21, 33, 46, 0.04), 0 6px 18px -8px rgba(21, 33, 46, 0.10)',
        'card-hover': '0 2px 4px rgba(21, 33, 46, 0.05), 0 14px 32px -12px rgba(21, 33, 46, 0.16)',
        'nav': '0 1px 2px rgba(21, 33, 46, 0.04), 0 8px 24px -14px rgba(21, 33, 46, 0.14)',
        'glow-gold': '0 6px 18px -8px rgba(201, 162, 39, 0.45)',
        'glow-blue': '0 8px 22px -10px rgba(29, 99, 157, 0.40)',
      },
      borderRadius: {
        '4xl': '2rem',
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
