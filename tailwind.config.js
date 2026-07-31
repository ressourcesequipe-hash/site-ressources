/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ocre: {
          DEFAULT: '#C8973A',
          light: '#D4AA5A',
          dark: '#A07828',
          pale: '#FDF0DC',
        },
        kaki: {
          DEFAULT: '#3D4A2D',
          light: '#556040',
          dark: '#2B3520',
          pale: '#EEF0EA',
        },
        // Vert olive moyen du bandeau HelloAsso : plus clair et plus doux que
        // le kaki, c'est le fond sur lequel repose le feuillage en filigrane.
        // light et dark sont les deux extremites du degrade de ces sections.
        olive: {
          DEFAULT: '#6B7550',
          light: '#7D8862',
          dark: '#59633F',
        },
        beige: {
          DEFAULT: '#EDE5D8',
          light: '#F7F3ED',
          dark: '#D5C9B5',
        },
        terre: '#2C2A26',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.7s ease-out both',
        'fade-in': 'fadeIn 0.6s ease-out both',
        'float': 'float 7s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'slide-right': 'slideRight 0.65s ease-out both',
        'scale-in': 'scaleIn 0.5s ease-out both',
        'spin-slow': 'spin 30s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'marquee': 'marquee 60s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(36px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-28px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundSize: {
        '200%': '200% 200%',
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
}
