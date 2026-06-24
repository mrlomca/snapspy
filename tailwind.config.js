/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'sans-serif'],
        display: ['Poppins', '-apple-system', 'sans-serif'],
      },
      colors: {
        snapbg: '#ECE04F',
        snapbg2: '#E6D944',
        cream: '#F4EEC9',
        'cream-dark': '#E7DC9C',
        snapblue: '#4FC3F7',
        'snapblue-dark': '#36B4EF',
        snapbrown: '#8C7B33',
        snapink: '#161616',
        snapgreen: '#2FAE54',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4.5s ease-in-out infinite',
        'load-fill': 'loadFill 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'ghost-run': 'ghostRun 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'wiggle': 'wiggle 0.9s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0.4' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        popIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        loadFill: {
          '0%': { width: '3%' },
          '100%': { width: '92%' },
        },
        ghostRun: {
          '0%': { left: '3%' },
          '100%': { left: '92%' },
        },
        wiggle: {
          '0%, 100%': { transform: 'translateX(-50%) rotate(-6deg)' },
          '50%': { transform: 'translateX(-50%) rotate(6deg)' },
        }
      }
    },
  },
  plugins: [],
}
