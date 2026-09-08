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
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        dark: {
          950: '#05070B',
          900: '#0A0F18',
          850: '#0F1624',
          800: '#172236',
          700: '#23334F',
          600: '#34496E',
        },
        whatsapp: {
          light: '#25D366',
          dark: '#128C7E',
          teal: '#075E54',
          bg: '#0c131a',
          bubbleOut: '#005c4b',
          bubbleIn: '#202c33'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.25)',
        'glow-green-sm': '0 0 10px rgba(34, 197, 94, 0.15)',
        'glow-green-lg': '0 0 30px rgba(34, 197, 94, 0.35)',
      }
    },
  },
  plugins: [],
}
