/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EAE0',
          border: '#E5DDD5',
        },
        navy: {
          DEFAULT: '#1B2A4A',
          light: '#2D4272',
          muted: '#4A5D7E',
          faint: '#8B9DC3',
        },
        teal: {
          DEFAULT: '#0F766E',
          light: '#14B8A6',
          muted: '#CCFBF1',
          faint: '#F0FDFA',
        },
        amber: {
          DEFAULT: '#D97706',
          light: '#F59E0B',
          muted: '#FEF3C7',
          faint: '#FFFBEB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(27,42,74,0.06), 0 4px 12px rgba(27,42,74,0.04)',
        'card-hover': '0 4px 16px rgba(27,42,74,0.10), 0 1px 4px rgba(27,42,74,0.06)',
        elevated: '0 8px 24px rgba(27,42,74,0.12), 0 2px 8px rgba(27,42,74,0.06)',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
