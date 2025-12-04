/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
      },
      colors: {
        mystic: {
          950: '#0a0510', // Darker background
          900: '#150a24',
          800: '#231238',
          700: '#351b52',
          600: '#4d2873',
          500: '#6a3b99',
          400: '#8c5cc4',
          300: '#b084e6',
          200: '#d1afff',
          100: '#eaddff',
          50: '#f6f0ff',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Base Gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      backgroundImage: {
        'glass': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'glass-active': 'linear-gradient(145deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
      }
    },
  },
  plugins: [],
}