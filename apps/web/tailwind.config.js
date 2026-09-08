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
          50:  '#f0fdf4',
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
          950: '#030508',
          900: '#070a10',
          850: '#0c1220',
          800: '#111827',
          750: '#1a2435',
          700: '#202d42',
          600: '#2d3f5e',
          500: '#3d5278',
        },
        neon: {
          green:  '#39ff14',
          lime:   '#7fff00',
          mint:   '#00ff85',
          teal:   '#00e5cc',
        },
        whatsapp: {
          light:    '#25D366',
          dark:     '#128C7E',
          teal:     '#075E54',
          bg:       '#0b1117',
          bubbleOut:'#005c4b',
          bubbleIn: '#1f2c34',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-green':    '0 0 20px rgba(34,197,94,0.25), 0 0 60px rgba(34,197,94,0.08)',
        'glow-green-sm': '0 0 10px rgba(34,197,94,0.18)',
        'glow-green-lg': '0 0 35px rgba(34,197,94,0.4), 0 0 80px rgba(34,197,94,0.12)',
        'glow-teal':     '0 0 20px rgba(20,184,166,0.3)',
        'obsidian':      '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        'card':          '0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
        'card-hover':    '0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(34,197,94,0.12)',
        'inner-glow':    'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      backgroundImage: {
        'obsidian-gradient':  'linear-gradient(135deg, #070a10 0%, #0c1220 50%, #070a10 100%)',
        'green-radial':       'radial-gradient(ellipse at top, rgba(34,197,94,0.12) 0%, transparent 70%)',
        'card-gradient':      'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
        'hero-gradient':      'linear-gradient(135deg, #070e18 0%, #0f1e2e 50%, #070e18 100%)',
      },
      animation: {
        'glow-pulse':    'glowPulse 2.5s ease-in-out infinite',
        'slide-up':      'slideUp 0.3s ease-out',
        'fade-in':       'fadeIn 0.2s ease-out',
        'shimmer':       'shimmer 2s linear infinite',
        'float':         'float 3s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(34,197,94,0.3)' },
          '50%':      { opacity: '0.7', boxShadow: '0 0 25px rgba(34,197,94,0.6)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl':   '1.5rem',
        '4xl':   '2rem',
      },
    },
  },
  plugins: [],
}
