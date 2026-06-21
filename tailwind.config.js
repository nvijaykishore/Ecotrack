/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f0f7f4',
          100: '#dceee5',
          200: '#b8ddcb',
          300: '#8cc5ab',
          400: '#5fa888',
          500: '#3d8b6e',
          600: '#2d6a4f',
          700: '#255543',
          800: '#1f4437',
          900: '#1a382e',
          950: '#0d1f19',
        },
        earth: {
          50: '#faf6f1',
          100: '#f3ebe0',
          200: '#e6d4bc',
          300: '#d4b896',
          400: '#c09a6f',
          500: '#a67c52',
          600: '#8b6342',
          700: '#6f4e36',
          800: '#5c4130',
          900: '#4d3729',
        },
        moss: {
          400: '#74a57f',
          500: '#588157',
          600: '#3a5a40',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};