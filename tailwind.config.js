/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pollon: {
          red: '#e10600',
          'red-dark': '#8b0000',
          'red-hover': '#c00500',
          black: '#0d0d0d',
          gold: '#f5c518',
          orange: '#ff9800',
          granate: '#6b0f1a',
          footer: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(13, 13, 13, 0.08)',
        float: '0 8px 32px rgba(225, 6, 0, 0.25)',
        soft: '0 2px 12px rgba(13, 13, 13, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
      },
    },
  },
  plugins: [],
};
